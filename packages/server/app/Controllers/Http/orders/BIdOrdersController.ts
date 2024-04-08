import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BidBookingCreateValidator from 'App/Validators/Booking/BidBookingCreateValidator'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import ServiceRequirement from 'App/Models/bid/ServiceRequirement'
import Database from '@ioc:Adonis/Lucid/Database'
import Bid from 'App/Models/bid/Bid'
import { OrderStatus } from 'App/Helpers/enums'
import { schema } from '@ioc:Adonis/Core/Validator'
import BidBooking from 'App/Models/bookings/BidBooking'
import BidOrder from 'App/Models/orders/BidOrder'
import BaseApiController from '../BaseApiController'

export default class BidBookingsController extends BaseApiController {
  public async myList({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('BidBookingPolicy').authorize('myList')

    const user = auth.user!

    let bidOrders: BidBooking[] = []

    const bidOrdersQuery = BidBooking.query()

    if (user instanceof VendorUser) {
      bidOrdersQuery.where('vendor_user_id', user.id)
    }

    if (user instanceof VendorUser) {
      bidOrdersQuery.where('user_id', user.id)
    }

    this.indexfilterQuery(request.qs() as any, bidOrdersQuery)

    if (request.qs().page) {
      bidOrders = await bidOrdersQuery.paginate(
        request.qs().page,
        request.qs().rowsPerPage || this.perPage
      )
    } else {
      bidOrders = await bidOrdersQuery.exec()
    }

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: bidOrders,
    })
  }

  public async store({ response, bouncer, request, auth }: HttpContextContract) {
    await bouncer.with('BidBookingPolicy').authorize('create')

    const payload = await request.validate(BidBookingCreateValidator)

    const serviceRequirement = await ServiceRequirement.findOrFail(payload.serviceRequirementId)

    if (!serviceRequirement.acceptedBidId) {
      return response.custom({
        code: 400,
        message: 'No Bid is accepted to place the order',
        data: null,
        success: false,
      })
    }

    const acceptedBid = await Bid.findOrFail(serviceRequirement.acceptedBidId)

    let bidOrder: BidBooking | null = null

    await Database.transaction(async (trx) => {
      bidOrder = await BidBooking.create({
        price: acceptedBid.offeredPrice,
        status: OrderStatus.PLACED,
        userId: auth.user?.id,
        vendorUserId: acceptedBid.vendorUserId,
        paymentDetail: payload.paymentdetail,
        bookingDetail: {
          serviceRequirement: {
            id: serviceRequirement.id,
            title: serviceRequirement.title,
            desc: serviceRequirement.desc,
            budgetType: serviceRequirement.budgetType,
            budget: serviceRequirement.budget,
          },
          acceptedBid: {
            id: acceptedBid.id,
            offeredPrice: acceptedBid.offeredPrice,
          },
        },
      })
    })

    if (bidOrder) {
      await (bidOrder as BidBooking).refresh()
    }

    return response.custom({
      code: 201,
      message: 'Bid Order Created',
      data: bidOrder,
      success: true,
    })
  }

  public async updateStatus({ response, bouncer, request, params }: HttpContextContract) {
    const bidOrder = await BidBooking.findOrFail(+params.id)

    await bouncer.with('BidBookingPolicy').authorize('update', bidOrder)

    const validationSchema = schema.create({
      status: schema.enum(Object.values(OrderStatus)),
    })

    const payload = await request.validate({ schema: validationSchema })

    bidOrder.merge({ status: payload.status })

    await bidOrder.save()

    return response.custom({
      code: 201,
      message: 'Bid Order Status Updated',
      data: bidOrder,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const bidOrder = await BidOrder.findOrFail(+params.id)

    await bouncer.with('BookingPolicy').authorize('delete')

    await bidOrder.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: bidOrder,
    })
  }
}
