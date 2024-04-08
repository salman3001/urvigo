import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Template from 'App/Models/email/Template'
import CreateTemplateValidator from 'App/Validators/news-letter/CreateTemplateValidator'
import { validator } from '@ioc:Adonis/Core/Validator'
import BaseApiController from '../BaseApiController'

export default class TemplatesController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('TemplatePolicy').authorize('viewList')
    const templateQuery = Template.query()

    this.applyFilters(templateQuery, request.qs(), { searchFields: ['name'] })

    this.extraFilters(templateQuery, request)

    const templates = await this.paginate(request, templateQuery)

    return response.custom({
      code: 200,
      data: templates,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('TemplatePolicy').authorize('view')
    const id = params.id
    const template = await Template.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: template,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('TemplatePolicy').authorize('create')

    const payload = await request.validate(CreateTemplateValidator)
    const template = await Template.create(payload.template)

    if (payload.thumbnail) {
      template.thumbnail = await ResponsiveAttachment.fromFile(payload.thumbnail)
    }

    await template.save()
    return response.custom({
      message: 'Template Created',
      code: 201,
      data: template,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('TemplatePolicy').authorize('update')

    const template = await Template.findOrFail(+params.id)
    const payload = await request.validate(CreateTemplateValidator)
    template.merge(payload.template)

    await template.save()

    if (payload.thumbnail) {
      template.thumbnail = await ResponsiveAttachment.fromFile(payload.thumbnail)
    }
    await template.save()
    return response.custom({
      message: 'Template Updated',
      code: 201,
      data: template,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const template = await Template.findOrFail(+params.id)

    await bouncer.with('TemplatePolicy').authorize('delete')

    await template.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: template,
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { thumbnail, ...rest } = record
    return rest
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    const validatedData = await validator.validate({
      schema: new CreateTemplateValidator(ctx).schema,
      data: {
        template: data,
      },
    })

    await Template.updateOrCreate({ id: validatedData.template!.id }, validatedData.template!)
  }
}
