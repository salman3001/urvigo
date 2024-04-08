import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'
import Service from 'App/Models/service/Service'
import ServiceCreateValidator from 'App/Validators/service/ServiceCreateValidator'
import ServiceUpdateValidator from 'App/Validators/service/ServiceUpdateValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import BaseApiController from '../BaseApiController'
import slugify from 'slugify'
import ServiceVariant from 'App/Models/service/ServiceVariant'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class ServiceController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('viewList')
    const serviceQuery = Service.query()
      .preload('serviceCategory', (s) => {
        s.select(['name'])
      })
      .preload('serviceSubcategory', (s) => {
        s.select(['id', 'name'])
      })
      .preload('tags', (s) => {
        s.select(['id', 'name'])
      })
      .preload('images')
      .preload('variants')
      .preload('images')
      .select([
        'id',
        'name',
        'slug',
        'short_desc',
        'is_active',
        'geo_location',
        'thumbnail',
        'avg_rating',
        'vendor_user_id',
        'service_category_id',
        'service_subcategory_id',
        'created_at',
      ])

    this.applyFilters(serviceQuery, request.qs(), { searchFields: ['name'] })

    this.extraFilters(serviceQuery, request)

    const services = await this.paginate(request, serviceQuery)

    return response.custom({
      code: 200,
      data: services,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('view')

    const id = params.id
    const serviceQuery = Service.query()
      .where('id', id)
      .preload('variants')
      .preload('vendorUser', (v) => {
        v.preload('profile')
        v.withCount('reviews')
      })
      .preload('reviews', (r) => {
        r.preload('user', (u) => {
          u.select(['first_name', 'last_name']).preload('profile', (p) => {
            p.select('avatar')
          })
        })
        r.limit(10)
      })
      .preload('faq')
      .preload('seo')
      .preload('tags')
      .preload('images')
      .withCount('reviews', (r) => {
        r.as('reviews_count')
      })

    const service = await serviceQuery.first()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: service,
    })
  }

  public async myList({ request, response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('myList')

    const serviceQuery = Service.query()
      .where('vendor_user_id', auth.user!.id)
      .preload('serviceCategory', (s) => {
        s.select(['name'])
      })
      .preload('serviceSubcategory', (s) => {
        s.select(['id', 'name'])
      })
      .preload('tags', (s) => {
        s.select(['id', 'name'])
      })
      .preload('images')
      .preload('variants')
      .preload('images')
      .select([
        'id',
        'name',
        'slug',
        'short_desc',
        'is_active',
        'geo_location',
        'thumbnail',
        'avg_rating',
        'vendor_user_id',
        'service_category_id',
        'service_subcategory_id',
        'created_at',
      ])

    this.applyFilters(serviceQuery, request.qs(), { searchFields: ['name'] })

    this.extraFilters(serviceQuery, request)

    const services = await this.paginate(request, serviceQuery)

    return response.custom({
      code: 200,
      data: services,
      success: true,
      message: null,
    })
  }

  public async showBySlug({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('view')

    const slug = params.slug
    const serviceQuery = Service.query()
      .where('slug', slug)
      .preload('variants')
      .preload('vendorUser', (v) => {
        v.preload('profile')
        v.withCount('reviews')
      })
      .preload('reviews', (r) => {
        r.preload('user', (u) => {
          u.select(['first_name', 'last_name']).preload('profile', (p) => {
            p.select('avatar')
          })
        })
        r.limit(10)
      })
      .preload('faq')
      .preload('seo')
      .preload('tags')
      .preload('images')
      .withCount('reviews', (r) => {
        r.as('reviews_count')
      })

    const service = await serviceQuery.first()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: service,
    })
  }

  public async store({ request, response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('create')

    const payload = await request.validate(ServiceCreateValidator)
    const slug = slugify(payload.service.name)

    let service: Service | null = null

    await Database.transaction(async (trx) => {
      service = await Service.create(
        { ...payload.service, vendorUserId: auth.user!.id, slug: slug },
        { client: trx }
      )

      if (payload.variant) {
        for (const [index, variantPayload] of payload.variant.entries()) {
          const variant = await ServiceVariant.create(
            { ...variantPayload, serviceId: service.id },
            { client: trx }
          )

          if (payload?.variantImages?.[index]) {
            variant.image = await ResponsiveAttachment.fromFile(payload?.variantImages[index])
          }

          await variant.save()
        }
      }

      if (payload.seo) {
        await service.related('seo').create(payload.seo)
      }

      if (payload.tags) {
        await service.related('tags').attach(payload.tags)
      }

      if (payload.faq) {
        await service.related('faq').createMany(payload.faq)
      }

      if (payload.thumbnail) {
        service.thumbnail = await ResponsiveAttachment.fromFile(payload.thumbnail)
      }

      if (payload.images) {
        for (const img of payload.images) {
          await service.related('images').create({ file: await ResponsiveAttachment.fromFile(img) })
        }
      }

      // if (payload.video) {
      //   service.video = Attachment.fromFile(payload.video)
      // }

      await service.save()
    })

    return response.custom({
      message: 'Service Added',
      code: 201,
      data: service,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    const payload = await request.validate(ServiceUpdateValidator)

    let service: Service | null = null

    await Database.transaction(async (trx) => {
      service = await Service.findOrFail(+params.id, { client: trx })
      await bouncer.with('ServicePolicy').authorize('update', service)

      if (payload.service) {
        if (payload.service?.name) {
          const slug = slugify(payload.service.name)
          service.merge({ ...payload.service, slug })
          await service.save()
        } else {
          service.merge(payload.service)
          await service.save()
        }
      }

      if (payload.variant) {
        await service.load('variants')

        if (service.variants) {
          for (const v of service.variants) {
            await v.delete()
          }
        }

        for (const [index, variantPayload] of payload.variant.entries()) {
          const variant = await ServiceVariant.create(
            { ...variantPayload, serviceId: service.id },
            { client: trx }
          )

          if (payload.variantImages?.[index]) {
            variant.image = await ResponsiveAttachment.fromFile(payload.variantImages?.[index])
          }
          await variant.save()
        }
      }

      if (payload.seo) {
        await service.load('seo')
        if (service.seo) {
          service.seo.merge(payload.seo)
          await service.seo.save()
        } else {
          await service.related('seo').create(payload.seo)
        }
      }

      if (payload.tags) {
        await service.related('tags').detach()
        await service.related('tags').attach(payload.tags)
      }

      if (payload.faq) {
        await service.load('faq')
        if (service.faq) {
          for (const f of service.faq) {
            await f.delete()
          }
        }
        await service.related('faq').createMany(payload.faq)
      }

      if (payload.thumbnail) {
        service.thumbnail = await ResponsiveAttachment.fromFile(payload.thumbnail)
      }

      if (payload.images) {
        // for (const img of service.images) {
        //   await img.delete()

        // }

        for (const img of payload.images) {
          await service.related('images').create({
            file: await ResponsiveAttachment.fromFile(img),
            serviceId: service.id,
          })
        }
      }

      // if (payload.video) {
      //   if (service.video) {

      //   service.video = Attachment.fromFile(payload.video)
      // }

      await service.save()
    })

    if (service) {
      await (service as Service).refresh()
    }

    return response.custom({
      message: 'Service Updated',
      code: 201,
      data: service,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const service = await Service.findOrFail(+params.id)
    await bouncer.with('ServicePolicy').authorize('delete', service)
    await service.delete()

    return response.custom({
      message: 'Service Deleted',
      code: 200,
      data: service,
      success: true,
    })
  }

  public async deleteScreenShot({ params, response }: HttpContextContract) {
    const image = await Image.findOrFail(+params.id)
    await image.delete()
    return response.custom({
      message: 'Service screenshot deleted',
      code: 200,
      data: image,
      success: true,
    })
  }

  public extraFilters(
    serviceQuery: ModelQueryBuilderContract<any, Service>,
    request: HttpContextContract['request']
  ) {
    serviceQuery.withCount('reviews', (r) => {
      r.as('reviews_count')
    })

    serviceQuery.withAggregate('variants', (v) => {
      v.min('price').as('starting_from')
    })
  }

  // public excludeIncludeExportProperties(record: any) {
  //   const { createdAt, updatedAt, logo, cover, brocher, ...rest } = record
  //   return rest
  // }

  // public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
  //   ctx.meta = {
  //     currentObjectId: data.id,
  //   }
  //   const validatedData = await validator.validate({
  //     schema: new ServiceUpdateValidator(ctx).schema,
  //     data: {
  //       service: data,
  //     },
  //   })

  //   await Service.updateOrCreate({ id: validatedData.service!.id }, validatedData.service!)
  // }
}
