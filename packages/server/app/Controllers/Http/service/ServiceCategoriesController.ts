import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ServiceCategory from 'App/Models/service/ServiceCategory'
import CategoryCreateValidator from 'App/Validators/service/CategoryCreateValidator'
import CategoryUpdateValidator from 'App/Validators/service/CategoryUpdateValidator'
import { validator } from '@ioc:Adonis/Core/Validator'
import slugify from 'slugify'
import BaseApiController from '../BaseApiController'

export default class ServiceCategoriesController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('viewList')
    const serviceCategoryQuery = ServiceCategory.query()

    this.applyFilters(serviceCategoryQuery, request.qs(), { searchFields: ['slug'] })

    this.extraFilters(serviceCategoryQuery, request)

    const categories = await serviceCategoryQuery.exec()

    return response.custom({
      code: 200,
      data: categories,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('view')
    const id = params.id
    const serviceCategory = await ServiceCategory.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: serviceCategory,
    })
  }

  public async showBySlug({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('view')
    const slug = params.slug
    const serviceCategory = await ServiceCategory.query().where('slug', slug).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: serviceCategory,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('create')
    const payload = await request.validate(CategoryCreateValidator)
    const slug = slugify(payload.category.name)
    const category = await ServiceCategory.create({ ...payload.category, slug })

    if (payload.seo) {
      await category.related('seo').create(payload.seo)
    }

    if (payload.faq) {
      await category.related('faqs').createMany(payload.faq)
    }

    if (payload.image) {
      category.thumbnail = await ResponsiveAttachment.fromFile(payload.image)
    }

    await category.save()
    return response.custom({
      message: 'Category Added',
      code: 201,
      data: category,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('update')

    const payload = await request.validate(CategoryUpdateValidator)
    const category = await ServiceCategory.findOrFail(+params.id)

    if (payload.category) {
      if (payload?.category?.name) {
        const slug = slugify(payload?.category.name)
        category.merge({ ...payload.category, slug })
        await category.save()
      } else {
        category.merge(payload.category)
        await category.save()
      }
    }

    if (payload.seo) {
      await category.load('seo')
      if (category.seo) {
        category.seo.merge(payload.seo)
        await category.seo.save()
      } else {
        await category.related('seo').create(payload.seo)
      }
    }

    if (payload.faq) {
      await category.load('faqs')
      if (category.faqs) {
        for (const f of category.faqs) {
          await f.delete()
        }
      }
      await category.related('faqs').createMany(payload.faq)
    }

    if (payload.image) {
      category.thumbnail = await ResponsiveAttachment.fromFile(payload.image)
    }
    await category.save()

    return response.custom({
      message: 'Category Updated',
      code: 201,
      data: category,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const category = await ServiceCategory.findOrFail(+params.id)

    await bouncer.with('ReviewPolicy').authorize('delete', category)

    await category.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: category,
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, thumbnail, subCategoryCount, ...rest } = record
    return rest
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    ctx.meta = {
      currentObjectId: data.id,
    }
    const validatedData = await validator.validate({
      schema: new CategoryUpdateValidator(ctx).schema,
      data: {
        category: data,
      },
    })

    await ServiceCategory.updateOrCreate(
      { id: validatedData.category!.id },
      validatedData.category!
    )
  }
}
