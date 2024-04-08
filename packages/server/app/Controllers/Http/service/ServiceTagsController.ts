import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ServiceTag from 'App/Models/service/ServiceTag'
import { validator } from '@ioc:Adonis/Core/Validator'
import TagsCreateValidator from 'App/Validators/service/TagsCreateValidator'
import TagsUpdateValidator from 'App/Validators/service/TagsUpdateValidator'
import BaseApiController from '../BaseApiController'
import slugify from 'slugify'

export default class ServiceTagsController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('viewList')
    const tagQuery = ServiceTag.query()

    this.applyFilters(tagQuery, request.qs(), { searchFields: ['slug'] })

    this.extraFilters(tagQuery, request)

    const tags = await tagQuery.exec()

    return response.custom({
      code: 200,
      data: tags,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('view')
    const id = params.id
    const tag = await ServiceTag.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: tag,
    })
  }

  public async showBySlug({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('view')
    const slug = params.slug
    const tag = await ServiceTag.query().where('slug', slug).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: tag,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('create')

    const payload = await request.validate(TagsCreateValidator)
    const slug = slugify(payload.category.name)
    const tag = await ServiceTag.create({ ...payload.category, slug })

    if (payload.seo) {
      await tag.related('seo').create(payload.seo)
    }

    if (payload.faq) {
      await tag.related('faqs').createMany(payload.faq)
    }

    if (payload.image) {
      tag.thumbnail = await ResponsiveAttachment.fromFile(payload.image)
    }

    await tag.save()

    return response.custom({
      message: 'Tag Added',
      code: 201,
      data: tag,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('update')

    const payload = await request.validate(TagsUpdateValidator)
    const tag = await ServiceTag.findOrFail(+params.id)

    if (payload.category) {
      if (payload?.category?.name) {
        const slug = slugify(payload?.category.name)
        tag.merge({ ...payload.category, slug })
        await tag.save()
      } else {
        tag.merge(payload.category)
        await tag.save()
      }
    }

    if (payload.seo) {
      await tag.load('seo')
      if (tag.seo) {
        tag.seo.merge(payload.seo)
        await tag.seo.save()
      } else {
        await tag.related('seo').create(payload.seo)
      }
    }

    if (payload.faq) {
      await tag.load('faqs')
      if (tag.faqs) {
        for (const f of tag.faqs) {
          await f.delete()
        }
      }
      await tag.related('faqs').createMany(payload.faq)
    }

    if (payload.image) {
      tag.thumbnail = await ResponsiveAttachment.fromFile(payload.image)
    }
    await tag.save()

    return response.custom({
      message: 'Tag updated',
      code: 201,
      data: tag,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const tag = await ServiceTag.findOrFail(+params.id)

    await bouncer.with('ServiceCategoryPolicy').authorize('delete')

    await tag.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: tag,
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, thumbnail, ...rest } = record
    return rest
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    ctx.meta = {
      currentObjectId: data.id,
    }
    const validatedData = await validator.validate({
      schema: new TagsUpdateValidator(ctx).schema,
      data: {
        category: data,
      },
    })

    await ServiceTag.updateOrCreate({ id: validatedData.category!.id }, validatedData.category!)
  }
}
