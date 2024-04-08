import { DateTime } from 'luxon'
import { column, BaseModel, afterCreate } from '@ioc:Adonis/Lucid/Orm'
import Ws from 'App/services/Ws'
import { NotificationTypes } from 'App/Helpers/enums'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({
    prepare: (v) => {
      return JSON.stringify(v)
    },
  })
  public data: {
    type: NotificationTypes
    message: string
    meta: Record<any, any>
  }

  @column()
  public userId: number

  @column()
  public adminUserId: number

  @column()
  public vendorUserId: number

  public async markAsRead() {
    this.readAt = DateTime.now()
    await this.save()
  }

  @column.dateTime()
  public readAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static pushNotification(notification: Notification) {
    let room = ''
    if (notification.userId) {
      room = `user:${notification.userId}`
    }
    if (notification.adminUserId) {
      room = `admin:${notification.adminUserId}`
    }
    Ws.io.of('/notifications/').to(room).emit('new-notification', notification)
  }
}
