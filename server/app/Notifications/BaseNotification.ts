import AdminUser from 'App/Models/adminUser/AdminUser'
import User from 'App/Models/user/User'

export abstract class BaseNotification {
  abstract users: [AdminUser | User]

  abstract create(user: User | AdminUser): void
}
