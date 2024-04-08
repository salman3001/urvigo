import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SupportTicket from 'App/Models/helpcenter/SupportTicket'
import { TicketStatus } from 'App/Helpers/enums'
import SupportTicketCreateValidator from 'App/Validators/helpcenter/SupportTicketCreateValidator'
import ChatMessage from 'App/Models/helpcenter/ChatMessage'
import AdminUser from 'App/Models/adminUser/AdminUser'
import User from 'App/Models/user/User'
import { schema } from '@ioc:Adonis/Core/Validator'
import BaseApiController from '../BaseApiController'

export default class SupportTicketsController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('SupportTicketPolicy').authorize('viewList')
    const SupportTicketQuery = SupportTicket.query()

    this.applyFilters(SupportTicketQuery, request.qs(), { searchFields: ['slug'] })

    this.extraFilters(SupportTicketQuery, request)

    const tickets = await this.paginate(request, SupportTicketQuery)

    return response.custom({
      code: 200,
      data: tickets,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    const id = params.id
    const ticket = await SupportTicket.query().where('id', id).firstOrFail()
    await bouncer.with('SupportTicketPolicy').authorize('view', ticket)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: ticket,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('SupportTicketPolicy').authorize('create')
    const payload = await request.validate(SupportTicketCreateValidator)
    const { message, ...restPayload } = payload
    const ticket = await SupportTicket.create(restPayload)
    if (message) {
      await ticket.related('messages').create({ message: message, type: 'User' })
    }
    const user = await AdminUser.findBy('id', 1)
    await user?.related('notifications').create({
      data: {
        message: 'New Support Ticket added',
      },
    })
    return response.custom({
      message: 'Ticket created',
      code: 201,
      data: ticket,
      success: true,
    })
  }

  public async changeStatus({ params, response, bouncer, request }: HttpContextContract) {
    const validationSchema = schema.create({
      status: schema.enum(Object.values(TicketStatus)),
    })

    const payload = await request.validate({ schema: validationSchema })

    bouncer.with('SupportTicketPolicy').authorize('update')
    const ticket = await SupportTicket.findOrFail(+params.id)

    ticket.status = payload.status
    await ticket.save()
    return response.custom({
      message: 'Ticket Status changed',
      code: 200,
      data: ticket,
      success: true,
    })
  }

  public async ticketMessages({ params, response, bouncer, request }: HttpContextContract) {
    const limit = request.qs().limit
    const page = request.qs().page
    const ticket = await SupportTicket.findOrFail(+params.id)
    bouncer.with('SupportTicketPolicy').authorize('view', ticket)

    const messages = await ChatMessage.query()
      .where('support_ticket_id', ticket.id)
      .orderBy('created_at', 'desc')
      .paginate(page ?? 1, limit ?? 20)

    return response.custom({
      message: null,
      code: 200,
      data: messages,
      success: true,
    })
  }

  public async createMessage({ params, response, bouncer, request, auth }: HttpContextContract) {
    const message = await request.input('message')
    const ticket = await SupportTicket.findOrFail(+params.id)
    bouncer.with('SupportTicketPolicy').authorize('view', ticket)

    if (message) {
      if (auth.user instanceof AdminUser)
        ticket.related('messages').create({
          message,
          type: 'AdminUser',
        })

      if (auth.user instanceof User)
        ticket.related('messages').create({
          message,
          type: 'User',
        })
    }

    return response.custom({
      message: 'Message Created',
      code: 201,
      data: message,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const ticket = await SupportTicket.findOrFail(+params.id)

    await bouncer.with('KnowledgebasePolicy').authorize('delete')

    await ticket.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: ticket,
    })
  }
}
