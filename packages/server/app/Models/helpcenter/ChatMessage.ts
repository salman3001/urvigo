import { DateTime } from 'luxon'
import { BaseModel, afterCreate, column } from '@ioc:Adonis/Lucid/Orm'
import Ws from 'App/services/Ws'

export default class ChatMessage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public message: string

  @column()
  public type: 'User' | 'AdminUser'

  @column()
  public supportTicketId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static pushNotification(message: ChatMessage) {
    let room = `ticket-chat-${message.supportTicketId}`
    Ws.io.of('/ticket_chat/').to(room).emit('new-message', message)
  }
}
