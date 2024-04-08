import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import VariantCreateValidator from 'App/Validators/service/VariantCreateValidator'
import ServiceVariant from 'App/Models/service/ServiceVariant'
import BaseApiController from '../BaseApiController'
import Service from 'App/Models/service/Service'

export default class ServiceVariantController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('viewList')
    const serviceVariantQuery = ServiceVariant.query().preload('service', (s) => {
      s.select(['name'])
    })

    this.applyFilters(serviceVariantQuery, request.qs(), { searchFields: ['name'] })

    const serviceVariant = await this.paginate(request, serviceVariantQuery)

    return response.custom({
      code: 200,
      data: serviceVariant,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('view')

    const id = +params.id
    const serviceVariantQuery = ServiceVariant.query()
      .where('id', id)
      .preload('service', (s) => {
        s.select(['name'])
      })

    const serviceVariant = await serviceVariantQuery.first()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: serviceVariant,
    })
  }

  public async store({ request, response, bouncer, params }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('create')

    const payload = await request.validate(VariantCreateValidator)

    let variant: ServiceVariant | null = null

    await Database.transaction(async (trx) => {
      const { image, ...restPayload } = payload

      variant = await ServiceVariant.create(
        { ...restPayload, serviceId: +params.serviceId },
        { client: trx }
      )

      if (image) {
        variant.image = await ResponsiveAttachment.fromFile(image)
      }

      await variant.save()
    })

    return response.custom({
      message: 'Service Variant Added',
      code: 201,
      data: variant,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    let variant = await ServiceVariant.findOrFail(+params.id)
    await variant.load('service')

    await bouncer.with('ServicePolicy').authorize('update', variant.service)

    const payload = await request.validate(VariantCreateValidator)

    await Database.transaction(async (trx) => {
      variant.useTransaction(trx)

      const { image, ...restPayload } = payload

      variant.merge(restPayload)
      await variant.save()

      if (image) {
        variant.image = await ResponsiveAttachment.fromFile(image)
      }

      await variant.save()
    })

    return response.custom({
      message: 'Service Variant updated',
      code: 201,
      data: variant,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const variant = await ServiceVariant.findOrFail(+params.id)
    const service = await Service.findOrFail(variant.serviceId)

    await bouncer.with('ServicePolicy').authorize('delete', service)

    await variant.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: variant,
    })
  }
}
