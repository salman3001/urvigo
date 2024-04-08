import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Notification from 'App/Models/Notification'
import AdminUser from 'App/Models/adminUser/AdminUser'
import User from 'App/Models/user/User'
import BaseApiController from './BaseApiController'

export default class NotificationsController extends BaseApiController {
  public async index({ response, auth }: HttpContextContract) {
    const user = auth.user

    if (!user) {
      return response.unauthorized()
    }

    const notifcationQuery = Notification.query()

    if (user instanceof AdminUser) {
      notifcationQuery.where('admin_user_id', user.id)
    }

    if (user instanceof User) {
      notifcationQuery.where('user_id', user.id)
    }

    const notification = notifcationQuery.exec()

    return response.custom({
      message: null,
      code: 200,
      data: notification,
      success: true,
    })
  }

  public async getMenuNotifications({ response, auth }: HttpContextContract) {
    const user = auth.user as AdminUser

    let notifcations: any[] = []
    let count: any = 0

    if (user) {
      await user.load('notifications', (b) => {
        b.orderBy('created_at').limit(20)
      })

      if (user instanceof AdminUser) {
        const query = await Database.query()
          .from('notifications')
          .select('id')
          .where('admin_user_id', user.id)
          .groupBy('id')
          .count('* as count')
          .first()

        if (!query) {
          count = 0
        } else {
          count = query.count
        }
      }

      if (user instanceof User) {
        const query = await Database.query()
          .from('notifications')
          .select('id')
          .where('user_id', user.id)
          .groupBy('id')
          .count('* as count')
          .first()

        if (!query) {
          count = 0
        } else {
          count = query.count
        }
      }

      notifcations = user.notifications
    }

    return response.custom({
      message: null,
      code: 200,
      data: { notifcations, count },
      success: true,
    })
  }

  public async destroyRead({ response, auth }: HttpContextContract) {
    const user = auth.user
    if (user) {
      await (user as AdminUser).load('notifications', (n) => {
        n.whereNotNull('read_at')
      })

      for (const n of user.notifications) {
        await n.delete()
      }
    }

    return response.custom({
      message: 'Notification deleted',
      code: 200,
      data: null,
      success: true,
    })
  }

  public async destroyAll({ response, auth }: HttpContextContract) {
    const user = auth.user

    if (user) {
      await (user as AdminUser).load('notifications')

      for (const n of user.notifications) {
        await n.delete()
      }
    }

    return response.custom({
      message: 'All Notification deleted',
      code: 200,
      data: null,
      success: true,
    })
  }

  public async markAsRead({ response, params }: HttpContextContract) {
    const id = +params.id
    const notification = await Notification.findOrFail(id)
    await notification.markAsRead()
    return response.custom({
      message: 'Notification marked as read',
      code: 200,
      data: notification,
      success: true,
    })
  }
}
