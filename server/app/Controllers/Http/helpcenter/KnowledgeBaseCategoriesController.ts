import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import KnowledgeBaseCategory from 'App/Models/helpcenter/KnowledgeBaseCategory'
import HelpcenterContentCategoryValidator from 'App/Validators/helpcenter/HelpcenterContentCategoryValidator'
import slugify from 'slugify'
import HelpcenterContentCategoryUpdateValidator from 'App/Validators/helpcenter/HelpcenterContentCategoryUpdateValidator'
import BaseApiController from '../BaseApiController'

export default class KnowledgeBaseCategoriesController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('viewList')
    const KnowledgeBaseCategoryQuery = KnowledgeBaseCategory.query()

    this.applyFilters(KnowledgeBaseCategoryQuery, request.qs(), { searchFields: ['name'] })

    this.extraFilters(KnowledgeBaseCategoryQuery, request)

    const categories = await this.paginate(request, KnowledgeBaseCategoryQuery)

    return response.custom({
      code: 200,
      data: categories,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('view')
    const id = params.id
    const category = await KnowledgeBaseCategory.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: category,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('create')

    const payload = await request.validate(HelpcenterContentCategoryValidator)
    const { slug, ...restPayload } = payload

    let record: any = null
    try {
      if (slug) {
        record = await KnowledgeBaseCategory.create(payload)
      } else {
        record = await KnowledgeBaseCategory.create({
          ...restPayload,
          slug: slugify(payload.name),
        })
      }
      return response.custom({
        message: 'Category Created',
        code: 201,
        data: record,
        success: true,
      })
    } catch (error) {
      return response.custom({
        message: 'Failed to create Category Created',
        code: 400,
        data: record,
        success: false,
      })
    }
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('update')
    const category = await KnowledgeBaseCategory.findOrFail(+params.id)

    const payload = await request.validate(HelpcenterContentCategoryUpdateValidator)
    const { slug, ...restPayload } = payload

    if (slug) {
      category.merge(payload)
      await category.save()
    } else {
      category.merge({
        ...restPayload,
        slug: slugify(payload.name),
      })
      await category.save()
    }

    return response.custom({
      message: 'Category updated',
      code: 201,
      data: category,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const category = await KnowledgeBaseCategory.findOrFail(+params.id)

    await bouncer.with('KnowledgebasePolicy').authorize('delete')

    await category.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: category,
    })
  }
}
