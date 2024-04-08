import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContactMessage from 'App/Models/helpcenter/ContactMessage'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import BaseApiController from '../BaseApiController'

export default class ContactMessagesController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ContactMessagePolicy').authorize('viewList')
    const ContactMessageQuery = ContactMessage.query()

    this.applyFilters(ContactMessageQuery, request.qs(), { searchFields: ['name'] })

    this.extraFilters(ContactMessageQuery, request)

    const contactmessages = await this.paginate(request, ContactMessageQuery)

    return response.custom({
      code: 200,
      data: contactmessages,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('ContactMessagePolicy').authorize('view')
    const id = params.id
    const contactmessage = await ContactMessage.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: contactmessage,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ContactMessagePolicy').authorize('create')
    const validationSchema = schema.create({
      name: schema.string(),
      title: schema.string(),
      email: schema.string({ escape: true }, [
        rules.email(),
        rules.normalizeEmail({ allLowercase: true }),
      ]),
      message: schema.string([rules.minLength(10)]),
    })

    const payload = await request.validate({ schema: validationSchema })
    const record = await ContactMessage.create(payload)
    return response.custom({
      message: 'Contact Message Created',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('ContactMessagePolicy').authorize('update')
    const message = await ContactMessage.findOrFail(+params.id)

    const payload = await request.validate({} as any)
    message.merge(payload)
    await message.save()
    return response.custom({
      message: 'Contact Message Updated',
      code: 201,
      data: message,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const contactmessage = await ContactMessage.findOrFail(+params.id)

    await bouncer.with('ContactMessagePolicy').authorize('delete')

    await contactmessage.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: contactmessage,
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, ...rest } = record
    return rest
  }
}
