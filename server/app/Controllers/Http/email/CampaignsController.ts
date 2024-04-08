import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Campaign from 'App/Models/email/Campaign'
import Template from 'App/Models/email/Template'
import CreateCampaignValidator from 'App/Validators/news-letter/CreateCampaignValidator'
import { validator } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import BaseApiController from '../BaseApiController'

export default class CampaignsController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('CampaignPolicy').authorize('viewList')
    const campaingQuery = Campaign.query()

    this.applyFilters(campaingQuery, request.qs(), { searchFields: ['name'] })

    this.extraFilters(campaingQuery, request)

    const blogs = await this.paginate(request, campaingQuery)

    return response.custom({
      code: 200,
      data: blogs,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('CampaignPolicy').authorize('view')

    const id = params.id
    const campaign = await Campaign.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: campaign,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('CampaignPolicy').authorize('create')

    const payload = await request.validate(CreateCampaignValidator)
    const campaign = await Campaign.create(payload.campaign)

    if (payload.interests) {
      await campaign.related('interests').attach(payload.interests)
    }

    if (payload.templateId) {
      const template = await Template.findBy('id', payload.templateId)
      if (template) {
        await campaign.related('template').save(template)
      }
    }

    return response.custom({
      message: 'Campaign Created!',
      code: 201,
      data: campaign,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('CampaignPolicy').authorize('update')

    const campaign = await Campaign.findOrFail(+params.id)
    const payload = await request.validate(CreateCampaignValidator)

    campaign.merge(payload.campaign)
    await campaign.save()

    if (payload.interests) {
      await campaign.related('interests').detach()
      await campaign.related('interests').attach(payload.interests)
    }

    if (payload.templateId) {
      await campaign.load('template')

      if (campaign.template) {
        console.log(campaign.template.id != payload.templateId)
        if (campaign.template.id != payload.templateId) {
          await campaign.template.related('campaign').dissociate()
          await campaign.refresh()
          const template = await Template.findBy('id', payload.templateId)
          if (template) {
            await campaign.related('template').save(template)
          }
        }
      } else {
        const template = await Template.findBy('id', payload.templateId)
        if (template) {
          await campaign.related('template').save(template)
        }
      }
    }

    return response.custom({
      message: 'Campaign Updated!',
      code: 201,
      data: campaign,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const campaign = await Campaign.findOrFail(+params.id)

    await bouncer.with('CampaignPolicy').authorize('delete')

    await campaign.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: campaign,
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, ...rest } = record
    const deliveryDate = DateTime.fromISO(rest.deliveryDateTime).toFormat('dd/MM/yyyy HH:mm') //=> '2014 Aug 06'
    return { ...rest, deliveryDateTime: deliveryDate }
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    const validatedData = await validator.validate({
      schema: new CreateCampaignValidator(ctx).schema,
      data: {
        campaign: data,
      },
    })

    await Campaign.updateOrCreate({ id: validatedData.campaign!.id }, validatedData.campaign!)
  }
}
