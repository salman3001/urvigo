import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BlogCategoryValidator from 'App/Validators/blogs/BlogCategoryValidator'
import slugify from 'slugify'
import BlogCategory from 'App/Models/blogs/BlogCategory'
import BlogCategoryUpdateValidator from 'App/Validators/blogs/BlogCategoryUpdateValidator'
import BaseApiController from '../BaseApiController'

export default class BlogCategoriesController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('BlogPolicy').authorize('viewList')
    const blogQuery = BlogCategory.query()

    this.applyFilters(blogQuery, request.qs(), { searchFields: ['name'] })

    this.extraFilters(blogQuery, request)

    const categories = await blogQuery.exec()

    return response.custom({
      code: 200,
      data: categories,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('BlogPolicy').authorize('view')

    const id = params.id
    const role = await BlogCategory.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: role,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('BlogPolicy').authorize('create')
    const { slug, ...payload } = await request.validate(BlogCategoryValidator)

    let category: BlogCategory | null = null

    if (slug) {
      category = await BlogCategory.create({ ...payload, slug })
    } else {
      category = await BlogCategory.create({ slug: slugify(payload.name), ...payload })
    }

    return response.custom({
      message: 'Blog category Created!',
      code: 201,
      data: category,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('BlogPolicy').authorize('update')
    const { slug, ...payload } = await request.validate(BlogCategoryUpdateValidator)
    const category = await BlogCategory.findOrFail(+params.id)

    if (slug) {
      category.merge({ ...payload, slug })
    } else {
      category.merge({ slug: slugify(payload.name), ...payload })
    }
    await category.save()

    return response.custom({
      message: 'Blog category updated!',
      code: 201,
      data: category,
      success: true,
    })
  }

  // public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
  //   ctx.meta = {
  //     currentObjectId: data.id,
  //   }
  //   const validatedData = await validator.validate({
  //     schema: new BlogCategoryUpdateValidator(ctx).schema,
  //     data,
  //   })
  //   await BlogCategory.updateOrCreate(
  //     { id: validatedData.id },
  //     {
  //       ...validatedData,
  //       slug: validatedData.slug ? slugify(validatedData.slug) : slugify(validatedData.name),
  //     }
  //   )
  // }
}
