// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CouponType, DiscountType, OrderStatus } from 'App/Helpers/enums'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import BigNumber from 'bignumber.js'
import Coupon from 'App/Models/orders/Coupon'
import Booking from 'App/Models/bookings/Booking'
import ServiceVariant from 'App/Models/service/ServiceVariant'
import BookingCreateValidator from 'App/Validators/Booking/BookingCreateValidator'
import BaseApiController from '../BaseApiController'
import { DateTime } from 'luxon'

export default class BookingController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('viewList')
    const bookingQuery = Booking.query()
      .preload('user', (u) => {
        u.select(['id', 'first_name', 'last_name']).preload('profile', (p) => {
          p.select(['avatar'])
        })
      })
      .preload('vendorUser', (v) => {
        v.select(['id', 'first_name', 'last_name']).preload('profile', (p) => {
          p.select(['avatar'])
        })
      })

    this.applyFilters(bookingQuery, request.qs(), { searchFields: ['name'] })

    this.extraFilters(bookingQuery, request)

    const bookings = await this.paginate(request, bookingQuery)

    return response.custom({
      code: 200,
      data: bookings,
      success: true,
      message: null,
    })
  }

  public async customerBookingList({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('BookingPolicy').authorize('customerList')

    const user = auth.user!

    const bookingQuery = Booking.query()
      .where('user_id', user.id)
      .preload('vendorUser', (v) => {
        v.select(['id', 'first_name', 'last_name']).preload('profile', (p) => {
          p.select(['avatar'])
        })
      })

    this.applyFilters(bookingQuery, request.qs())

    this.extraFilters(bookingQuery, request)

    const bookings = await this.paginate(request, bookingQuery)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: bookings,
    })
  }

  public async venodrBookingList({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('BookingPolicy').authorize('vendorList')

    const user = auth.user!

    const bookingQuery = Booking.query()
      .where('vendor_user_id', user.id)
      .preload('user', (u) => {
        u.select(['id', 'first_name', 'last_name']).preload('profile', (p) => {
          p.select(['avatar'])
        })
      })

    this.applyFilters(bookingQuery, request.qs())

    this.extraFilters(bookingQuery, request)

    const bookings = await this.paginate(request, bookingQuery)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: bookings,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    const id = params.id
    const booking = await Booking.query().where('id', id).firstOrFail()

    await bouncer.with('BookingPolicy').authorize('view', booking)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: booking,
    })
  }

  public async summary({ response, bouncer, request }: HttpContextContract) {
    await bouncer.with('BookingPolicy').authorize('create')

    const validationSchema = schema.create({
      serviceVariantId: schema.number(),
      qty: schema.number(),
      couponId: schema.number.optional(),
    })

    const payload = await request.validate({
      schema: validationSchema,
    })

    const serviceVariant = await ServiceVariant.findOrFail(payload.serviceVariantId)

    await serviceVariant.load('service', (service) => {
      service.preload('vendorUser')
    })

    const total_without_discount = new BigNumber(serviceVariant.price).times(payload.qty)
    let vendor_discount = new BigNumber(0)

    if (serviceVariant.discountType === DiscountType.FLAT) {
      vendor_discount = vendor_discount.plus(
        new BigNumber(serviceVariant.discountFlat).times(payload.qty)
      )
    } else if (serviceVariant.discountPercentage) {
      const percentage = new BigNumber(serviceVariant.discountPercentage)
      vendor_discount = vendor_discount.plus(
        percentage.dividedBy(100).times(serviceVariant.price).times(payload.qty)
      )
    }
    const total_after_discount = total_without_discount.minus(vendor_discount)

    const coupon_discount = payload.couponId
      ? await this.applyCoupon(
        payload.couponId,
        total_after_discount,
        serviceVariant.service.vendorUser.id
      )
      : 0

    const grand_total = total_after_discount.minus(coupon_discount)

    const booking = {
      service_variant: serviceVariant,
      qty: payload.qty,
      total_without_discount: total_without_discount.toFixed(2),
      vendor_discount: vendor_discount.toFixed(2),
      total_after_discount: total_after_discount.toFixed(2),
      coupon_discount: coupon_discount.toFixed(2),
      grand_total: grand_total.toFixed(2),
    }

    return response.custom({
      code: 200,
      message: null,
      data: booking,
      success: true,
    })
  }

  public async store({ response, bouncer, request, auth }: HttpContextContract) {
    await bouncer.with('BookingPolicy').authorize('create')

    const payload = await request.validate(BookingCreateValidator)

    const serviceVariant = await ServiceVariant.findOrFail(payload.serviceVariantId)

    await serviceVariant.load('service', (service) => {
      service.preload('vendorUser')
    })

    const total_without_discount = new BigNumber(serviceVariant.price).times(payload.qty)
    let vendor_discount = new BigNumber(0)

    if (serviceVariant.discountType === DiscountType.FLAT) {
      vendor_discount = vendor_discount.plus(
        new BigNumber(serviceVariant.discountFlat).times(payload.qty)
      )
    } else if (serviceVariant.discountPercentage) {
      const percentage = new BigNumber(serviceVariant.discountPercentage)
      vendor_discount = vendor_discount.plus(
        percentage.dividedBy(100).times(serviceVariant.price).times(payload.qty)
      )
    }

    const total_after_discount = total_without_discount.minus(vendor_discount)

    const coupon_discount = payload.couponId
      ? await this.applyCoupon(
        payload.couponId,
        total_after_discount,
        serviceVariant.service.vendorUser.id
      )
      : 0

    const grand_total = total_after_discount.minus(coupon_discount)

    const booking = await Booking.create({
      vendorUserId: serviceVariant.service.vendorUser.id,
      userId: auth.user?.id,
      status: OrderStatus.PLACED,
      history: [
        {
          date_time: DateTime.now(),
          event: 'Order Placed',
          remarks: '',
        },
      ],
      paymentDetail: payload.paymentdetail,
      bookingDetail: {
        service_variant: {
          id: serviceVariant.id,
          qty: payload.qty,
          name: serviceVariant.name,
          price: serviceVariant.price,
          image: serviceVariant.image,
          service_id: serviceVariant.serviceId,
          service_name: serviceVariant.service.name,
        },
        total_without_discount: total_without_discount.toFixed(2),
        vendor_discount: vendor_discount.toFixed(2),
        total_after_discount: total_after_discount.toFixed(2),
        coupon_discount: coupon_discount.toFixed(2),
        grand_total: grand_total.toFixed(2),
      },
    })

    return response.custom({
      code: 201,
      message: 'Service Booked Successfully',
      data: booking,
      success: true,
    })
  }

  public async updateStatus({ response, bouncer, request, params }: HttpContextContract) {
    const booking = await Booking.findOrFail(+params.id)
    await bouncer.with('BookingPolicy').authorize('update', booking)

    const validationSchema = schema.create({
      status: schema.enum(Object.values(OrderStatus)),
      remarks: schema.string.optional({ escape: true }, [rules.maxLength(255)]),
    })

    const payload = await request.validate({ schema: validationSchema })

    await Database.transaction(async (trx) => {
      booking.useTransaction(trx)
      booking.merge({ status: payload.status })
      booking.history.push({
        date_time: DateTime.now(),
        event: `Booking ${payload.status}`,
        remarks: payload?.remarks || '',
      })
      await booking.save()
    })

    await booking.refresh()

    return response.custom({
      code: 200,
      message: 'Booking status updated',
      data: booking,
      success: true,
    })
  }

  public async getCoupons({ response, bouncer, auth, request }: HttpContextContract) {
    await bouncer.with('BookingPolicy').authorize('create')

    const validationSchema = schema.create({
      serviceVariantId: schema.number(),
    })

    const payload = await request.validate({ schema: validationSchema })
    const serviceVariant = await ServiceVariant.query()
      .where('id', payload.serviceVariantId)
      .preload('service', (service) => {
        service.select('id')
      })
      .first()

    const serviceIds = serviceVariant?.service.id as number

    const coupons = await Coupon.query()
      //   .where('expired_at', '>', DateTime.local().plus({ minute: 10 }).toSQL())
      //   .where('valid_from', '<', DateTime.local().toSQL())
      .whereHas('services', (service) => {
        service.where('services.id', serviceIds)
      })

    const adminCoupons = await Coupon.query().where('coupon_type', CouponType.ADMIN)
    //   .where('expired_at', '>', DateTime.local().plus({ minute: 10 }).toSQL())
    //   .where('valid_from', '<', DateTime.local().toSQL())

    return response.custom({
      code: 200,
      message: null,
      data: [...coupons, ...adminCoupons],
      success: true,
    })
  }

  public async applyCoupon(
    couponId: number | undefined,
    total_amount: BigNumber,
    vendor_user_id: number,
    trx?: TransactionClientContract
  ): Promise<BigNumber> {
    const coupon = await Coupon.query()
      .where('id', couponId || '')
      .first()

    let coupan_discount_amount = new BigNumber(0)

    if (coupon) {
      if (coupon?.couponType == CouponType.VENDOR && coupon.vendorUserId == vendor_user_id) {
        if (coupon.discountType == DiscountType.FLAT) {
          coupan_discount_amount = coupan_discount_amount.plus(coupon.discountFlat)
        }

        if (coupon.discountType == DiscountType.PERCENATAGE) {
          const percentage = new BigNumber(coupon.discountPercentage)
          coupan_discount_amount = coupan_discount_amount.plus(
            percentage.dividedBy(100).times(total_amount)
          )
        }
      } else if (coupon.couponType === CouponType.ADMIN) {
        if (coupon.discountType == DiscountType.FLAT) {
          coupan_discount_amount = coupan_discount_amount.plus(coupon.discountFlat)
        }

        if (coupon.discountType == DiscountType.PERCENATAGE) {
          const percentage = new BigNumber(coupon.discountPercentage)
          coupan_discount_amount = coupan_discount_amount.plus(
            percentage.dividedBy(100).times(total_amount)
          )
        }
      }
    }

    return coupan_discount_amount
  }
}
