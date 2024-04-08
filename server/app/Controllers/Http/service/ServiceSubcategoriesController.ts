import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ServiceSubcategory from 'App/Models/service/ServiceSubcategory'
import { validator } from '@ioc:Adonis/Core/Validator'
import SubcategoryCreateValidator from 'App/Validators/service/SubcategoryCreateValidator'
import SubcategoryUpdateValidator from 'App/Validators/service/SubcategoryUpdateValidator'
import slugify from 'slugify'
import BaseApiController from '../BaseApiController'

export default class ServiceSubcategoriesController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('viewList')
    const serviceCategoryQuery = ServiceSubcategory.query()

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
    const serviceCategory = await ServiceSubcategory.query().where('id', id).firstOrFail()

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
    const serviceCategory = await ServiceSubcategory.query().where('slug', slug).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: serviceCategory,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('create')

    const payload = await request.validate(SubcategoryCreateValidator)
    const slug = slugify(payload.category.name)
    const category = await ServiceSubcategory.create({ ...payload.category, slug })

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
      message: 'Subcategory Added',
      code: 201,
      data: category,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('update')

    const payload = await request.validate(SubcategoryUpdateValidator)
    const category = await ServiceSubcategory.findOrFail(+params.id)

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
      message: 'Subcategory Updated',
      code: 201,
      data: category,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const category = await ServiceSubcategory.findOrFail(+params.id)

    await bouncer.with('ServiceCategoryPolicy').authorize('delete')

    await category.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: category,
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
      schema: new SubcategoryUpdateValidator(ctx).schema,
      data: {
        category: data,
      },
    })

    await ServiceSubcategory.updateOrCreate(
      { id: validatedData.category!.id },
      validatedData.category!
    )
  }
}
