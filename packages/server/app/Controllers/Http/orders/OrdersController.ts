// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/orders/Order'
import BaseController from '../BaseController'
import OrderCreateValidator from 'App/Validators/Booking/BookingCreateValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/user/User'
import Cart from 'App/Models/user/Cart'
import { CouponType, DiscountType, OrderStatus } from 'App/Helpers/enums'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { schema } from '@ioc:Adonis/Core/Validator'
import BigNumber from 'bignumber.js'
import Coupon from 'App/Models/orders/Coupon'
import { IOrderGroup, IOrderGroupWithDiscount, IOrderGroupsByVender } from 'App/Helpers/types'
import OrderGroup from 'App/Models/orders/OrderGroup'
import { DateTime } from 'luxon'

export default class OrdersController extends BaseController {
  constructor() {
    super(Order, OrderCreateValidator, OrderCreateValidator, 'OrderPolicy')
  }

  public async customerOrdersList({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('OrderPolicy').authorize('customerList')

    const user = auth.user!

    let ordersGroups: OrderGroup[] = []

    const orderGroupQuery = OrderGroup.query().where('user_id', user.id)
    this.indexfilterQuery(request.qs() as any, orderGroupQuery)

    if (request.qs().page) {
      ordersGroups = await orderGroupQuery.paginate(
        request.qs().page,
        request.qs().rowsPerPage || this.perPage
      )
    } else {
      ordersGroups = await orderGroupQuery.exec()
    }

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: ordersGroups,
    })
  }

  public async venodrOrdersList({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('OrderPolicy').authorize('vendorList')

    const user = auth.user!

    let orders: Order[] = []

    const orderGroupQuery = Order.query().where('vendor_user_id', user.id)
    this.indexfilterQuery(request.qs() as any, orderGroupQuery)

    if (request.qs().page) {
      orders = await orderGroupQuery.paginate(
        request.qs().page,
        request.qs().rowsPerPage || this.perPage
      )
    } else {
      orders = await orderGroupQuery.exec()
    }

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: orders,
    })
  }

  public async summary({ response, bouncer, auth, request }: HttpContextContract) {
    await bouncer.with('OrderPolicy').authorize('create')
    const user = auth.user as User
    const cart = await Cart.query()
      .where('user_id', user.id)
      .preload('items', (item) => {
        item.preload('serviceVariant', (variant) => {
          variant.preload('service', (service) => {
            service.select('name', 'business_id').preload('business', (business) => {
              business.select('name', 'id', 'vendor_user_id').preload('vendor')
            })
          })
        })
      })
      .first()

    const couponId = request.body().couponId

    const orderGroupsByVendor = await this.groupOrdersByVendor(cart)

    const orders = await this.applyCoupon(orderGroupsByVendor, couponId)

    return response.custom({
      code: 200,
      message: null,
      data: orders,
      success: true,
    })
  }

  public async store({ response, auth, bouncer, request }: HttpContextContract) {
    await bouncer.with('OrderPolicy').authorize('create')
    const payload = await request.validate(OrderCreateValidator)
    const user = auth.user as User
    const couponId = request.body().couponId

    const cart = await Cart.query()
      .where('user_id', user.id)
      .preload('items', (item) => {
        item.preload('serviceVariant', (variant) => {
          variant.preload('service', (service) => {
            service.select('name', 'business_id').preload('business', (business) => {
              business.select('name', 'id', 'vendor_user_id').preload('vendor')
            })
          })
        })
      })
      .first()

    if (cart!.items.length < 1) {
      return response.custom({
        code: 400,
        message: 'Cart must contain atleast 01 item',
        data: null,
        success: false,
      })
    }

    let orderGroup: OrderGroup | null = null

    await Database.transaction(async (trx) => {
      cart?.useTransaction(trx)
      const orderGroupsByVendor = this.groupOrdersByVendor(cart)

      const { orders, ...restOrder } = await this.applyCoupon(orderGroupsByVendor, couponId, trx)

      orderGroup = await OrderGroup.create(
        {
          orderGroupDetail: restOrder,
          paymentDetail: payload.paymentdetail,
          userId: user.id,
        },
        { client: trx }
      )

      for (const order of orders) {
        await orderGroup.related('orders').create({
          vendorUserId: order.vendorId,
          status: OrderStatus.PLACED,
          orderDetail: order,
        })
      }

      for (const item of cart!.items) {
        await item.delete()
      }
    })

    if (orderGroup) {
      await orderGroup.refresh()
    }

    return response.custom({
      code: 201,
      message: 'Order created successfully',
      data: orderGroup,
      success: true,
    })
  }

  public async updateStatus({ response, bouncer, request, params }: HttpContextContract) {
    const order = await Order.findOrFail(+params.id)
    await bouncer.with('OrderPolicy').authorize('update', order)

    const validationSchema = schema.create({
      status: schema.enum(Object.values(OrderStatus)),
    })

    const payload = await request.validate({ schema: validationSchema })

    await Database.transaction(async (trx) => {
      order.useTransaction(trx)
      order.merge({ status: payload.status })
      await order.save()
    })

    await order.refresh()

    return response.custom({
      code: 200,
      message: 'Order status updated',
      data: order,
      success: true,
    })
  }

  public async getCoupons({ response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('OrderPolicy').authorize('create')

    const cart = await Cart.query()
      .where('user_id', auth.user!.id)
      .preload('items', (item) => {
        item.preload('serviceVariant', (variant) => {
          variant.select('id', 'service_id').preload('service', (service) => {
            service.select('id')
          })
        })
      })
      .first()

    const serviceIds = this.getServiceIdsfromCart(cart!)

    const coupons = await Coupon.query()
      .where('expired_at', '>', DateTime.local().plus({ minute: 10 }).toSQL())
      .where('valid_from', '<', DateTime.local().toSQL())
      .whereHas('services', (service) => {
        service.whereIn('services.id', serviceIds)
      })

    const adminCoupons = await Coupon.query()
      .where('coupon_type', CouponType.ADMIN)
      .where('expired_at', '>', DateTime.local().plus({ minute: 10 }).toSQL())
      .where('valid_from', '<', DateTime.local().toSQL())

    console.log(DateTime.local().plus({ minute: 10 }).toSQL())

    return response.custom({
      code: 200,
      message: null,
      data: [...coupons, ...adminCoupons],
      success: true,
    })
  }

  public groupOrdersByVendor(cart: Cart | null): IOrderGroupsByVender {
    let groupedItems: IOrderGroupsByVender = {}

    if (cart) {
      groupedItems = cart.items.reduce((result: IOrderGroupsByVender, item) => {
        const vendorId = item.serviceVariant.service.business.vendor.id

        const item_total_without_discount = new BigNumber(item.qty).times(item.serviceVariant.price)

        const discount_type = item.serviceVariant.discountType

        const total_percentage_discount = item_total_without_discount
          .times(item.serviceVariant.discountPercentage)
          .dividedBy(100)

        const item_discount =
          discount_type === DiscountType.FLAT
            ? new BigNumber(item.serviceVariant.discountFlat)
            : discount_type === DiscountType.PERCENATAGE
              ? total_percentage_discount
              : new BigNumber(0)

        const item_total = item_total_without_discount.minus(item_discount)

        if (!result[vendorId]) {
          result[vendorId] = {
            vendorId,
            items: [
              {
                qty: item.qty,
                serviceVariant: {
                  service_id: item.serviceVariant.service.id,
                  service_name: item.serviceVariant.service.name,
                  disocunt_type: item.serviceVariant.discountType,
                  disocunt_flat: item.serviceVariant.discountFlat as string,
                  disocunt_percentage: item.serviceVariant.discountPercentage as string,
                  id: item.serviceVariant.id,
                  name: item.serviceVariant.name,
                  price: item.serviceVariant.price as string,
                },
                item_total_without_discount: item_total_without_discount.toFixed(2),
                item_discount: item_discount.toFixed(2),
                item_total: item_total.toFixed(2),
              },
            ],
            order_total_without_discount: item_total_without_discount.toFixed(2),
            order_total_discount: item_discount.toFixed(2),
            coupon_discount: '0.00',
            order_total: item_total.toFixed(2),
          }
        } else {
          // Increment total price for the order
          result[vendorId].items.push({
            qty: item.qty,
            serviceVariant: {
              service_id: item.serviceVariant.service.id,
              service_name: item.serviceVariant.service.name,
              disocunt_type: item.serviceVariant.discountType,
              disocunt_flat: item.serviceVariant.discountFlat as string,
              disocunt_percentage: item.serviceVariant.discountPercentage as string,
              id: item.serviceVariant.id,
              name: item.serviceVariant.name,
              price: item.serviceVariant.price as string,
            },
            item_total_without_discount: item_total_without_discount.toFixed(2),
            item_discount: item_discount.toFixed(2),
            item_total: item_total.toFixed(2),
          })

          result[vendorId].order_total_without_discount = new BigNumber(
            result[vendorId].order_total_without_discount
          )
            .plus(item_total_without_discount)
            .toFixed(2)

          result[vendorId].order_total_discount = new BigNumber(
            result[vendorId].order_total_discount
          )
            .plus(item_discount)
            .toFixed(2)

          result[vendorId].coupon_discount = '0.00'

          result[vendorId].order_total = new BigNumber(result[vendorId].order_total)
            .plus(item_total)
            .toFixed(2)
        }

        return result
      }, {})
    }
    return groupedItems
  }

  public async applyCoupon(
    orderGroupsByVendor: IOrderGroupsByVender,
    couponId: number,
    trx?: TransactionClientContract
  ): Promise<IOrderGroupWithDiscount> {
    let coupon: Coupon | null = null

    if (couponId) {
      coupon = await Coupon.query({ client: trx })
        .where('id', couponId)
        .preload('services', (services) => {
          services.select('id')
        })
        .first()
    }

    let grand_total_without_discount = new BigNumber(0)
    let grand_total_discount = new BigNumber(0)
    let grand_total_coupon_discount = new BigNumber(0)
    let grand_total = new BigNumber(0)

    const orders: IOrderGroup[] = Object.values(orderGroupsByVendor).map((group, i) => {
      const groupVendorId = group.vendorId

      if (coupon?.couponType == CouponType.VENDOR && coupon.vendorUserId == groupVendorId) {
        let coupan_discount_amount = new BigNumber(0)

        if (coupon.discountType == DiscountType.FLAT) {
          coupan_discount_amount = coupan_discount_amount.plus(coupon.discountFlat)
          console.log(coupan_discount_amount.toFixed(2))
        }

        if (coupon.discountType == DiscountType.PERCENATAGE) {
          const percentage = new BigNumber(coupon.discountPercentage)
          coupan_discount_amount = coupan_discount_amount.plus(
            percentage.dividedBy(100).times(group.order_total)
          )
        }

        group.order_total = new BigNumber(group.order_total)
          .minus(coupan_discount_amount)
          .toFixed(2)
        group.coupon_discount = coupan_discount_amount.toFixed()

        grand_total_coupon_discount = grand_total_coupon_discount.plus(coupan_discount_amount)
      }

      grand_total = grand_total.plus(group.order_total)
      grand_total_discount = grand_total_discount.plus(group.order_total_discount)
      grand_total_without_discount = grand_total_without_discount.plus(
        group.order_total_without_discount
      )

      return { ...group, orderNo: i + 1 }
    })

    if (coupon?.couponType == CouponType.ADMIN) {
      let coupan_discount_amount = new BigNumber(0)

      if (coupon.discountType == DiscountType.FLAT) {
        coupan_discount_amount = coupan_discount_amount.plus(coupon.discountFlat)
      }

      if (coupon.discountType == DiscountType.PERCENATAGE) {
        const percentage = new BigNumber(coupon.discountPercentage)
        coupan_discount_amount = coupan_discount_amount.plus(
          percentage.dividedBy(100).times(grand_total)
        )
      }

      grand_total = new BigNumber(grand_total).minus(coupan_discount_amount)

      grand_total_coupon_discount = grand_total_coupon_discount.plus(coupan_discount_amount)
    }

    return {
      grand_total_without_discount: grand_total_without_discount.toFixed(2),
      grand_total_discount: grand_total_discount.toFixed(2),
      grand_total_coupon_discount: grand_total_coupon_discount.toFixed(2),
      grand_total: grand_total.toFixed(2),
      orders,
    }
  }

  public getServiceIdsfromCart(cart: Cart): number[] {
    const serviceIds: number[] = []

    if (cart?.items) {
      for (const item of cart.items) {
        if (!serviceIds.includes(item.serviceVariant.service.id)) {
          serviceIds.push(item.serviceVariant.service.id)
        }
      }
    }

    return serviceIds
  }
}
