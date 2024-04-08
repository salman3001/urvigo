import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { isAdmin } from 'App/Helpers/permissionHelpers'
import Notification from 'App/Models/Notification'

export default class NotificationPolicy extends BasePolicy {
  public async viewList(user: any) {
    return false
  }

  public async view(user: any, notification: Notification) {
    return false
  }

  public async create(user: any) {
    return false
  }

  public async update(user: any, notification: Notification) {
    if (isAdmin(user) && notification.adminUserId == user.id) {
      return true
    } else if (!isAdmin(user) && notification.userId === user.id) {
      return true
    } else {
      return false
    }
  }

  public async delete(user: any, notification: Notification) {
    if (isAdmin(user) && notification.adminUserId == user.id) {
      return true
    } else if (!isAdmin(user) && notification.userId === user.id) {
      return true
    } else {
      return false
    }
  }
}
