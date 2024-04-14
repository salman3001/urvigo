import Conversation from 'App/Models/chat/Conversation'
import ConversationValidator from 'App/Validators/chat/ConversationValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdminUser from 'App/Models/adminUser/AdminUser'
import { ResponseContract } from '@ioc:Adonis/Core/Response'
import { userTypes } from 'App/Helpers/enums'
import MessageValidator from 'App/Validators/chat/MessageValidator'
import Message from 'App/Models/chat/Message'
import User from 'App/Models/user/User'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import Database from '@ioc:Adonis/Lucid/Database'
import ConversationParticipant from 'App/Models/chat/ConversationParticipant'
import { DateTime } from 'luxon'
import BaseApiController from '../BaseApiController'

export default class ConversationsController extends BaseApiController {
  public async index({ request, response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('viewList')
    const conversationQuery = Conversation.query()
      .where((builder) => {
        builder
          .where('participant_one_identifier', `${auth.user?.userType}-${auth.user?.id}`)
          .orWhere('participant_two_identifier', `${auth.user?.userType}-${auth.user?.id}`)
      })
      .preload('participantOne', (s) => {
        s.preload('user', (u) => {
          u.preload('profile', (p) => {
            p.select('avatar')
          })
        })
          .preload('vendorUser', (v) => {
            v.preload('profile', (p) => {
              p.select('avatar')
            })
          })
          .preload('adminUser', (a) => {
            a.preload('profile', (p) => {
              p.select('avatar')
            })
          })
      })
      .preload('participantTwo', (s) => {
        s.preload('user', (u) => {
          u.preload('profile', (p) => {
            p.select('avatar')
          })
        })
          .preload('vendorUser', (v) => {
            v.preload('profile', (p) => {
              p.select('avatar')
            })
          })
          .preload('adminUser', (a) => {
            a.preload('profile', (p) => {
              p.select('avatar')
            })
          })
      })
      .preload('messages', (m) => {
        m.orderBy('created_at', 'desc').groupLimit(1)
      })
      .withCount('messages', (m) => {
        m.where('read', 0)
          .whereNot('user_identifier', `${auth.user?.userType}-${auth.user?.id}`)
          .as('unread_messages')
      })
      .orderBy('created_at', 'desc')

    this.applyFilters(conversationQuery, request.qs(), { searchFields: ['name'] })

    const conversation = await this.paginate(request, conversationQuery)

    return response.custom({
      code: 200,
      data: conversation,
      success: true,
      message: null,
    })
  }

  public async getConversationMessages({
    response,
    params,
    bouncer,
    request,
    auth,
  }: HttpContextContract): Promise<ResponseContract> {
    const conversation = await Conversation.findOrFail(+params.id)

    await bouncer.with('ConversationPolicy').authorize('view', conversation)

    await Message.query()
      .where('conversation_id', conversation.id)
      .whereNot('user_identifier', `${auth.user?.userType}-${auth.user?.id}`)
      .update('read', 1)
      .exec()

    const messagesQuery = Message.query()
      .where('conversation_id', conversation.id)
      .orderBy('created_at', 'desc')

    this.applyFilters(request.qs() as any, messagesQuery)

    const messages = await this.paginate(request, messagesQuery)

    return response.custom({
      code: 200,
      message: null,
      data: messages,
      success: true,
    })
  }

  public async store({
    request,
    response,
    bouncer,
    auth,
  }: HttpContextContract): Promise<ResponseContract> {
    await bouncer.with('ConversationPolicy').authorize('create')
    const payload = await request.validate(ConversationValidator)

    let conversation: Conversation | null = null
    const identifierOne = `${auth.user?.userType}-${auth.user!.id}`
    const identifierTwo = `${payload.participant.userType}-${payload.participant.userId}`

    conversation = await Conversation.query()
      .where((b) => {
        b.where('participant_one_identifier', identifierOne).andWhere(
          'participant_two_identifier',
          identifierTwo
        )
      })
      .orWhere((b) => {
        b.where('participant_two_identifier', identifierOne).andWhere(
          'participant_one_identifier',
          identifierTwo
        )
      })
      .first()

    if (conversation) {
      return response.custom({
        code: 200,
        message: 'Conversation already exist',
        success: true,
        data: conversation,
      })
    }

    if (!conversation) {
      await Database.transaction(async (trx) => {
        conversation = await Conversation.create({ name: payload.name }, { client: trx })

        if (auth.user?.userType === userTypes.USER) {
          const participantOne = await ConversationParticipant.firstOrCreate(
            { userIdentifier: identifierOne },
            {
              userId: auth.user.id,
              userIdentifier: identifierOne,
            },
            { client: trx }
          )

          await conversation.related('participantOne').associate(participantOne)
          conversation.participantOneIdentifier = identifierOne
          await conversation.save()
        }

        if (auth.user?.userType === userTypes.VENDER) {
          const participantOne = await ConversationParticipant.firstOrCreate(
            { userIdentifier: identifierOne },
            {
              vendorUserId: auth.user.id,
              userIdentifier: identifierOne,
            },
            { client: trx }
          )

          await conversation.related('participantOne').associate(participantOne)
          conversation.participantOneIdentifier = identifierOne
          await conversation.save()
        }

        if (auth.user?.userType === userTypes.ADMIN) {
          const participantOne = await ConversationParticipant.firstOrCreate(
            { userIdentifier: identifierOne },
            {
              adminUserId: auth.user.id,
              userIdentifier: identifierOne,
            },
            { client: trx }
          )

          await conversation.related('participantOne').associate(participantOne)
          conversation.participantOneIdentifier = identifierOne
          await conversation.save()
        }

        if (payload.participant.userType == userTypes.USER) {
          const participantTwo = await ConversationParticipant.firstOrCreate(
            { userIdentifier: identifierTwo },
            {
              userId: payload.participant.userId,
              userIdentifier: identifierTwo,
            },
            { client: trx }
          )

          await conversation.related('participantTwo').associate(participantTwo)
          conversation.participantTwoIdentifier = identifierTwo
          await conversation.save()
        }

        if (payload.participant.userType == userTypes.VENDER) {
          const participantTwo = await ConversationParticipant.firstOrCreate(
            { userIdentifier: identifierTwo },
            {
              vendorUserId: payload.participant.userId,
              userIdentifier: identifierTwo,
            },
            { client: trx }
          )

          await conversation.related('participantTwo').associate(participantTwo)
          conversation.participantTwoIdentifier = identifierTwo
          await conversation.save()
        }

        if (payload.participant.userType == userTypes.ADMIN) {
          const participantTwo = await ConversationParticipant.firstOrCreate(
            { userIdentifier: identifierTwo },
            {
              adminUserId: payload.participant.userId,
              userIdentifier: identifierTwo,
            },
            { client: trx }
          )

          await conversation.related('participantTwo').associate(participantTwo)
          conversation.participantTwoIdentifier = identifierTwo
          await conversation.save()
        }
      })
    }
    return response.custom({
      code: 201,
      message: 'Conversation Created',
      success: true,
      data: conversation,
    })
  }

  public async createMessage({
    request,
    response,
    bouncer,
    params,
    auth,
  }: HttpContextContract): Promise<ResponseContract> {
    const conversation = await Conversation.findOrFail(+params.id)
    await bouncer.with('ConversationPolicy').authorize('update', conversation)

    const payload = await request.validate(MessageValidator)

    let message: Message | null = null

    Database.transaction(async (trx) => {
      message = new Message()
      message.useTransaction(trx)
      message.body = payload.body
      message.conversationId = conversation.id
      if (auth.user instanceof User) {
        message.userIdentifier = `${userTypes.USER}-${auth.user.id}`
      }
      if (auth.user instanceof VendorUser) {
        message.userIdentifier = `${userTypes.VENDER}-${auth.user.id}`
      }

      if (auth.user instanceof AdminUser) {
        message.userIdentifier = `${userTypes.ADMIN}-${auth.user.id}`
      }

      await message.save()

      conversation.useTransaction(trx)
      conversation.merge({ updatedAt: DateTime.now() })
      await conversation.save()
    })

    return response.custom({
      code: 201,
      message: 'Message Created',
      success: true,
      data: message,
    })
  }

  public async markAllAsRead({
    response,
    bouncer,
    params,
    auth,
  }: HttpContextContract): Promise<ResponseContract> {
    const conversation = await Conversation.findOrFail(+params.id)
    await bouncer.with('ConversationPolicy').authorize('update', conversation)

    const userIdentifier = `${auth.user?.userType}-${auth.user!.id}`

    await conversation
      .related('messages')
      .query()
      .where('user_identifier', userIdentifier)
      .where('read', 0)
      .update({ read: 1 })
      .exec()

    return response.custom({
      code: 201,
      message: 'Marked As read',
      success: true,
      data: null,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const conversation = await Conversation.findOrFail(+params.id)

    await bouncer.with('ConversationPolicy').authorize('delete', conversation)

    await conversation.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: conversation,
    })
  }
}
