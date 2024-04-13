import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ServiceRequirement from 'App/Models/bid/ServiceRequirement'
import ServiceRequirementCreateValidator from 'App/Validators/bid/ServiceRequirementCreateValidator'
import Database from '@ioc:Adonis/Lucid/Database'

import Bid from 'App/Models/bid/Bid'
import BaseApiController from '../BaseApiController'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import ServiceTag from 'App/Models/service/ServiceTag'
import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import BigNumber from 'bignumber.js'
import slugify from 'slugify'
import VendorUser from 'App/Models/vendorUser/VendorUser'

export default class ServiceRequirementController extends BaseApiController {
  public async index({ response, bouncer, request }: HttpContextContract) {
    await bouncer.with('ServiceRequirementPolicy').authorize('viewList')

    const serviceRequirementQuery = ServiceRequirement.query()
      .preload('user', (u) => {
        u.select(['first_name', 'last_name']).preload('profile', (p) => {
          p.select('avatar')
        })
      })
      .preload('serviceCategory', (c) => {
        c.select('name')
      })
      .preload('tags', (t) => {
        t.select(['name'])
      })

    this.applyFilters(serviceRequirementQuery, request.qs(), { searchFields: ['name'] })
    this.extraFilters(serviceRequirementQuery, request)

    const serviceRequirements = await this.paginate(request, serviceRequirementQuery)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: serviceRequirements,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.query()
      .where('id', +params.id)
      .preload('serviceCategory', (s) => {
        s.select('name')
      })
      .preload('user', (u) => {
        u.preload('profile')
      })
      .withCount('recievedBids')
      .withAggregate('recievedBids', (b) => {
        b.avg('offered_price').as('avgBidPrice')
      })
      .preload('images')
      .preload('tags', (t) => {
        t.select(['name'])
      })
      .firstOrFail()

    await bouncer.with('ServiceRequirementPolicy').authorize('view', serviceRequirement)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: serviceRequirement,
    })
  }

  public async myList({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('ServiceRequirementPolicy').authorize('myList')

    const user = auth.user!

    const serviceRequirementQuery = ServiceRequirement.query()
      .where('user_id', user.id)
      .preload('user', (u) => {
        u.select(['first_name', 'last_name']).preload('profile', (p) => {
          p.select('avatar')
        })
      })
      .preload('serviceCategory', (s) => {
        s.select(['name'])
      })
      .withCount('recievedBids')
      .withAggregate('recievedBids', (b) => {
        b.avg('offered_price').as('avgBidPrice')
      })
      .preload('tags', (t) => {
        t.select(['name'])
      })

    this.applyFilters(serviceRequirementQuery, request.qs() as any)
    this.extraFilters(serviceRequirementQuery, request)

    const serviceRequirement = await this.paginate(request, serviceRequirementQuery)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: serviceRequirement,
    })
  }

  public async showAcceptedBid({ bouncer, params, response }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    await bouncer.with('ServiceRequirementPolicy').authorize('view', serviceRequirement)

    const bidQuery = Bid.query()
      .where('id', serviceRequirement.acceptedBidId || 0)
      .preload('vendorUser', (v) => {
        v.select(['first_name', 'last_name', 'id', 'avg_rating', 'business_name']).preload(
          'profile',
          (p) => {
            p.select('avatar')
          }
        )
      })

    const bid = await bidQuery.first()

    return response.custom({
      code: 200,
      message: null,
      data: bid,
      success: true,
    })
  }

  public async showVendorPlacedbid({ bouncer, params, response, auth }: HttpContextContract) {
    const isVendor = auth.user instanceof VendorUser
    if (!isVendor) {
      return response.custom({
        code: 401,
        message: 'Unautorized! Only vendor can request for applied bid',
        data: null,
        success: false,
      })
    }

    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    await bouncer.with('ServiceRequirementPolicy').authorize('view', serviceRequirement)

    const bidQuery = Bid.query()
      .where('service_requirement_id', serviceRequirement.id || 0)
      .whereHas('vendorUser', (v) => {
        v.where('id', auth.user!.id)
      })
      .preload('vendorUser', (v) => {
        v.select(['first_name', 'last_name', 'id', 'avg_rating', 'business_name']).preload(
          'profile',
          (p) => {
            p.select('avatar')
          }
        )
      })

    const bid = await bidQuery.first()

    return response.custom({
      code: 200,
      message: null,
      data: bid,
      success: true,
    })
  }

  public async showBids({ bouncer, params, response, request }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    await bouncer.with('ServiceRequirementPolicy').authorize('view', serviceRequirement)

    const bidQuery = Bid.query()
      .where('service_requirement_id', serviceRequirement.id)
      .preload('vendorUser', (v) => {
        v.select('avg_rating')
      })

    if (request.qs()?.orderby_avg_rating) {
      bidQuery.join('vendor_users', 'bids.vendor_user_id', 'vendor_users.id')
      bidQuery.whereNot('bids.id', serviceRequirement?.acceptedBidId || 0)
      bidQuery.select('bids.*')
      bidQuery.orderBy('vendor_users.avg_rating', 'desc')
    } else if (request.qs()?.orderby_lowest_price) {
      bidQuery.whereNot('id', serviceRequirement?.acceptedBidId || 0)
      bidQuery.orderBy('offered_price', 'asc')
      bidQuery.select('*')
    } else {
      bidQuery.whereNot('id', serviceRequirement?.acceptedBidId || 0)
      bidQuery.orderBy('created_at', 'desc')
    }

    this.applyFilters(bidQuery, request.qs())

    const bids = await this.paginate(request, bidQuery)

    return response.custom({
      code: 200,
      message: null,
      data: bids,
      success: true,
    })
  }

  public async store({ auth, bouncer, request, response }: HttpContextContract) {
    await bouncer.with('ServiceRequirementPolicy').authorize('create')

    const { keywords, images, ...payload } = await request.validate(
      ServiceRequirementCreateValidator
    )

    let serviceRequirement: ServiceRequirement | null = null

    await Database.transaction(async (trx) => {
      serviceRequirement = await ServiceRequirement.create(
        { ...payload, userId: auth.user!.id },
        { client: trx }
      )

      if (keywords) {
        const tags = await ServiceTag.fetchOrCreateMany(
          'name',
          keywords.map((k) => ({ name: k, slug: slugify(k) }))
        )
        await serviceRequirement.related('tags').saveMany(tags)
      }

      if (images) {
        for (const i of images) {
          await serviceRequirement
            .related('images')
            .create({ file: await ResponsiveAttachment.fromFile(i) })
        }
      }
    })

    if (serviceRequirement) {
      await (serviceRequirement as ServiceRequirement).refresh()
    }

    return response.custom({
      code: 201,
      message: 'Service requirement created',
      data: serviceRequirement,
      success: true,
    })
  }

  public async update({ auth, bouncer, request, response, params }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)
    await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

    const payload = await request.validate(ServiceRequirementCreateValidator)

    await Database.transaction(async (trx) => {
      serviceRequirement.useTransaction(trx)
      serviceRequirement.merge({ ...payload, userId: auth.user!.id })
      await serviceRequirement.save()
    })

    await serviceRequirement.refresh()

    return response.custom({
      code: 200,
      message: 'Service requirement update',
      data: serviceRequirement,
      success: true,
    })
  }

  public async negotiate({ auth, bouncer, request, response, params }: HttpContextContract) {
    const validationSchema = schema.create({
      bidId: schema.number(),
      price: schema.number([rules.minNumber(0)]),
      message: schema.string({ escape: true }, [rules.maxLength(255)]),
    })

    const payload = await request.validate({ schema: validationSchema })

    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    const bid = await Bid.query()
      .where('id', payload.bidId)
      .where('serviceRequirementId', serviceRequirement.id)
      .firstOrFail()

    await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

    const lastNegotiiate = bid.negotiateHistory[bid.negotiateHistory.length - 1]

    if (lastNegotiiate.accepted === false) {
      return response.custom({
        code: 400,
        data: null,
        message: 'Previous negotiate is still pending',
        success: false,
      })
    }

    bid.negotiateHistory.push({
      asked_price: new BigNumber(payload.price).toFixed(2),
      date_time: DateTime.now(),
      message: payload.message,
      accepted: false,
    })

    await bid.save()

    return response.custom({
      code: 200,
      data: null,
      message: 'Negotiate created',
      success: true,
    })
  }

  public extraFilters(
    serviceRequirementQuery: ModelQueryBuilderContract<any, ServiceRequirement>,
    request: HttpContextContract['request'],
    opt?: {}
  ) {
    if (request.qs().where_acepted) {
      serviceRequirementQuery.whereNotNull('accepted_bid_id')
    }

    if (request.qs().where_active) {
      serviceRequirementQuery.whereNull('accepted_bid_id')
    }

    if (request.qs().where_expires_at_lt) {
      serviceRequirementQuery.where('expires_at', '<', request.qs().where_expires_at_lt)
    }
    if (request.qs().where_expires_at_gt) {
      serviceRequirementQuery.where('expires_at', '>', request.qs().where_expires_at_gt)
    }
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    await bouncer.with('ServiceRequirementPolicy').authorize('delete', serviceRequirement)

    await serviceRequirement.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: serviceRequirement,
    })
  }

  // public async acceptBid({ bouncer, request, response, params }: HttpContextContract) {
  //   const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

  //   if (serviceRequirement.acceptedBidId) {
  //     return response.custom({
  //       code: 400,
  //       message: 'You have already accepted a serviceRequirement',
  //       data: null,
  //       success: false,
  //     })
  //   }
  //   await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

  //   const validationSchema = schema.create({
  //     serviceRequirementId: schema.number(),
  //   })

  //   const payload = await request.validate({ schema: validationSchema })

  //   await Database.transaction(async (trx) => {
  //     serviceRequirement.useTransaction(trx)
  //     serviceRequirement.merge({ acceptedBidId: payload.serviceRequirementId })
  //     await serviceRequirement.save()
  //   })

  //   await serviceRequirement.refresh()

  //   return response.custom({
  //     code: 200,
  //     message: 'serviceRequirement Accepted',
  //     data: serviceRequirement,
  //     success: true,
  //   })
  // }

  // public async rejectBid({ bouncer, request, response, params }: HttpContextContract) {
  //   const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

  //   if (!serviceRequirement.acceptedBidId) {
  //     return response.custom({
  //       code: 400,
  //       message: 'You have not accepted any serviceRequirement',
  //       data: null,
  //       success: false,
  //     })
  //   }

  //   await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

  //   await Database.transaction(async (trx) => {
  //     serviceRequirement.useTransaction(trx)
  //     serviceRequirement.merge({ acceptedBidId: null })
  //     await serviceRequirement.save()
  //   })

  //   await serviceRequirement.refresh()

  //   return response.custom({
  //     code: 200,
  //     message: 'serviceRequirement Rejected',
  //     data: serviceRequirement,
  //     success: true,
  //   })
  // }
}
