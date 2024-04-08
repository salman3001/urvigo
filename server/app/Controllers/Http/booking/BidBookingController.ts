import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BidBookingCreateValidator from 'App/Validators/Booking/BidBookingCreateValidator'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import ServiceRequirement from 'App/Models/bid/ServiceRequirement'
import Bid from 'App/Models/bid/Bid'
import { OrderStatus } from 'App/Helpers/enums'
import { schema } from '@ioc:Adonis/Core/Validator'
import BidBooking from 'App/Models/bookings/BidBooking'
import BigNumber from 'bignumber.js'
import User from 'App/Models/user/User'
import Database from '@ioc:Adonis/Lucid/Database'
import BaseApiController from '../BaseApiController'
import { DateTime } from 'luxon'

export default class BidBookingController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('viewList')
    const bookingQuery = BidBooking.query()
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

  public async myList({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('BidBookingPolicy').authorize('myList')

    const user = auth.user!

    const bidBookingQuery = BidBooking.query()
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

    if (user instanceof VendorUser) {
      bidBookingQuery.where('vendor_user_id', user.id)
    }

    if (user instanceof User) {
      bidBookingQuery.where('user_id', user.id)
    }
    this.applyFilters(bidBookingQuery, request.qs(), { searchFields: ['name'] })

    this.extraFilters(bidBookingQuery, request)

    const bidBookings = await this.paginate(request, bidBookingQuery)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: bidBookings,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    const id = params.id
    const booking = await BidBooking.query().where('id', id).firstOrFail()

    await bouncer.with('BidBookingPolicy').authorize('view', booking)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: booking,
    })
  }

  public async store({ response, bouncer, request, auth }: HttpContextContract) {
    await bouncer.with('BidBookingPolicy').authorize('create')

    const payload = await request.validate(BidBookingCreateValidator)

    const serviceRequirement = await ServiceRequirement.findOrFail(payload.serviceRequirementId)

    const bid = await Bid.findOrFail(payload.acceptedBidId)

    const price = new BigNumber(bid.offeredPrice).times(payload.qty)

    let bidBooking: BidBooking | null = null

    await Database.transaction(async (trx) => {
      bidBooking = await BidBooking.create(
        {
          price: price.toFixed(2),
          qty: payload.qty,
          status: OrderStatus.PLACED,
          userId: auth.user?.id,
          vendorUserId: bid.vendorUserId,
          paymentDetail: payload.paymentdetail,
          history: [
            {
              date_time: DateTime.now(),
              event: 'Order Placed',
              remarks: ''
            }
          ],
          bookingDetail: {
            serviceRequirement: {
              id: serviceRequirement.id,
              title: serviceRequirement.title,
              desc: serviceRequirement.desc,
              budgetUnit: serviceRequirement.budgetUnit,
              budget: serviceRequirement.budget,
            },
            acceptedBid: {
              id: bid.id,
              offeredPrice: bid.offeredPrice,
            },
          },
        },
        { client: trx }
      )

      serviceRequirement.useTransaction(trx)
      serviceRequirement.acceptedBidId = bid.id
      await serviceRequirement.save()
    })

    return response.custom({
      code: 201,
      message: 'Bid Order Created',
      data: bidBooking,
      success: true,
    })
  }

  public async updateStatus({ response, bouncer, request, params }: HttpContextContract) {
    const bidBooking = await BidBooking.findOrFail(+params.id)

    await bouncer.with('BidBookingPolicy').authorize('update', bidBooking)

    const validationSchema = schema.create({
      status: schema.enum(Object.values(OrderStatus)),
      remarks: schema.string.optional()
    })

    const payload = await request.validate({ schema: validationSchema })

    bidBooking.merge({ status: payload.status })
    bidBooking.history.push({
      date_time: DateTime.now(),
      event: `Booking ${payload.status}`,
      remarks: payload?.remarks || '',
    })

    await bidBooking.save()

    return response.custom({
      code: 201,
      message: 'Bid Order Status Updated',
      data: bidBooking,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const bidBooking = await BidBooking.findOrFail(+params.id)

    await bouncer.with('BidBookingPolicy').authorize('delete', bidBooking)

    await bidBooking.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: bidBooking,
    })
  }
}
