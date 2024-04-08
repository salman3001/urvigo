import AdminUser from 'App/Models/adminUser/AdminUser'
import User from 'App/Models/user/User'
import { BaseNotification } from './BaseNotification'

export class TestNotification extends BaseNotification {
  users: [AdminUser | User]

  constructor(users?: [AdminUser | User]) {
    super()
    this.users = users ?? ([] as unknown as [AdminUser])
  }

  public async create(user: AdminUser | User) {
    if (user) {
      await (user as AdminUser).related('notifications').create({
        data: {
          type: 'test',
          message: `this is test notification for admin ${user.firstName}`,
        },
      })
    }
    if (user instanceof User) {
      await user.related('notifications').create({
        data: {
          type: 'test',
          message: `this is test notification for user ${user.firstName}`,
        },
      })
    }
  }
}
