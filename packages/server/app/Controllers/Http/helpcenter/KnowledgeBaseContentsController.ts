import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HelpcenterContentValidator from 'App/Validators/helpcenter/HelpcenterContentValidator'
import slugify from 'slugify'
import KnowledgeBaseContent from 'App/Models/helpcenter/KnowledgeBaseContent'
import HelpcenterContentUpdateValidator from 'App/Validators/helpcenter/HelpcenterContentUpdateValidator'
import BaseApiController from '../BaseApiController'

export default class KnowledgeBaseContentsController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('viewList')
    const KnowledgeBaseCatentQuery = KnowledgeBaseContent.query()

    this.applyFilters(KnowledgeBaseCatentQuery, request.qs(), { searchFields: ['slug'] })

    this.extraFilters(KnowledgeBaseCatentQuery, request)

    const contents = await this.paginate(request, KnowledgeBaseCatentQuery)

    return response.custom({
      code: 200,
      data: contents,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('view')
    const id = params.id
    const content = await KnowledgeBaseContent.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: content,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('create')

    const payload = await request.validate(HelpcenterContentValidator)
    const { slug, ...restPayload } = payload

    let record: any = null

    if (slug) {
      record = await KnowledgeBaseContent.create(payload)
    } else {
      record = await KnowledgeBaseContent.create({
        ...restPayload,
        slug: slugify(payload.title),
      })
    }
    return response.custom({
      message: 'Content Created',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('update')
    const content = await KnowledgeBaseContent.findOrFail(+params.id)
    const payload = await request.validate(HelpcenterContentUpdateValidator)
    const { slug, ...restPayload } = payload

    if (slug) {
      content.merge(payload)
      await content.save()
    } else {
      content.merge({
        ...restPayload,
        slug: slugify(payload.title),
      })
      await content.save()
    }
    return response.custom({
      message: 'Content Updated',
      code: 201,
      data: content,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const content = await KnowledgeBaseContent.findOrFail(+params.id)

    await bouncer.with('KnowledgebasePolicy').authorize('delete')

    await content.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: content,
    })
  }
}
