import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CampaignType from 'App/Models/email/CampaignType'
import BaseApiController from '../BaseApiController'

export default class CampaignTypesController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('CampaignPolicy').authorize('viewList')
    const campaignTypeQuery = CampaignType.query()

    this.applyFilters(campaignTypeQuery, request.qs(), { searchFields: ['name'] })

    this.extraFilters(campaignTypeQuery, request)

    const campaignType = await this.paginate(request, campaignTypeQuery)

    return response.custom({
      code: 200,
      data: campaignType,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('CampaignPolicy').authorize('view')

    const id = params.id
    const campaign = await CampaignType.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: campaign,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('CampaignPolicy').authorize('create')
    const payload = await request.validate({} as any)
    const record = await CampaignType.create(payload)
    return response.custom({
      message: 'Campaign type Created!',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('CampaignPolicy').authorize('update')
    const campaignType = await CampaignType.findOrFail(+params.id)
    const payload = await request.validate({} as any)
    campaignType.merge(payload)
    await campaignType.save()
    return response.custom({
      message: 'Campaign type Updated!',
      code: 201,
      data: campaignType,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const campaignType = await CampaignType.findOrFail(+params.id)

    await bouncer.with('CampaignPolicy').authorize('delete')

    await campaignType.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: campaignType,
    })
  }
}
