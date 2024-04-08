import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Bid from 'App/Models/bid/Bid'
import BidValidator from 'App/Validators/bid/BidValidator'
import ServiceRequirement from 'App/Models/bid/ServiceRequirement'
import BaseApiController from '../BaseApiController'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class BidController extends BaseApiController {
  public async index({ request, response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('BidPolicy').authorize('viewList')

    const bidsQuery = Bid.query().where('vendor_user_id', auth.user!.id)

    this.applyFilters(bidsQuery, request.qs(), { searchFields: [] })

    this.extraFilters(bidsQuery, request)

    const bids = await this.paginate(request, bidsQuery)

    return response.custom({
      code: 200,
      data: bids,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    const id = params.id
    const bid = await Bid.query().where('id', id).firstOrFail()

    await bouncer.with('BidPolicy').authorize('view', bid)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: bid,
    })
  }

  public async store({ auth, bouncer, request, response }: HttpContextContract) {
    await bouncer.with('BidPolicy').authorize('create')

    const payload = await request.validate(BidValidator)

    const serviceRequirment = await ServiceRequirement.query()
      .where('id', payload.serviceRequirementId)
      .whereHas('recievedBids', (r) => {
        r.whereHas('vendorUser', (v) => {
          v.where('id', auth.user!.id)
        })
      })
      .first()

    if (serviceRequirment) {
      return response.custom({
        code: 400,
        message: 'You have already sent proposal for this requirement',
        data: null,
        success: false,
      })
    }

    let bid: Bid | null = null

    await Database.transaction(async (trx) => {
      bid = await Bid.create({ ...payload, vendorUserId: auth.user!.id }, { client: trx })
    })

    if (bid) {
      await (bid as Bid).refresh()
    }

    return response.custom({
      code: 201,
      message: 'Bid placed',
      data: bid,
      success: true,
    })
  }

  public async update({ auth, bouncer, request, response, params }: HttpContextContract) {
    const bid = await Bid.findOrFail(+params.id)
    await bouncer.with('BidPolicy').authorize('update', bid)

    const payload = await request.validate(BidValidator)

    await Database.transaction(async (trx) => {
      bid.useTransaction(trx)
      bid.merge({ ...payload, vendorUserId: auth.user!.id })
      await bid.save()
    })

    await bid.refresh()

    return response.custom({
      code: 200,
      message: 'Bid updated',
      data: bid,
      success: true,
    })
  }

  public async acceptNegotiation({
    auth,
    bouncer,
    request,
    response,
    params,
  }: HttpContextContract) {
    const bid = await Bid.findOrFail(+params.id)
    await bouncer.with('BidPolicy').authorize('update', bid)

    const validationSchema = schema.create({
      newPrice: schema.number([rules.maxNumber(Number(bid.offeredPrice))]),
    })

    const payload = await request.validate({ schema: validationSchema })

    if (bid.negotiateHistory.length < 1) {
      return response.custom({
        code: 400,
        message: 'Negotiation is not requested',
        data: null,
        success: false,
      })
    }

    const lastNegotiiate = bid.negotiateHistory[bid.negotiateHistory.length - 1]

    bid.negotiateHistory[bid.negotiateHistory.length - 1] = {
      ...lastNegotiiate,
      accepted: true,
    }

    bid.offeredPrice = payload.newPrice

    await bid.save()

    return response.custom({
      code: 200,
      message: 'Bid updated with new price',
      data: bid,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const bid = await Bid.findOrFail(+params.id)

    await bouncer.with('BidPolicy').authorize('delete', bid)

    await bid.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: bid,
    })
  }
}
