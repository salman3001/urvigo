import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { permissions } from 'App/Helpers/enums'
import { hasPermission, isAdmin } from 'App/Helpers/permissionHelpers'
import AdminUser from 'App/Models/adminUser/AdminUser'

export default class AdminUserPolicy extends BasePolicy {
  public async viewList(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_ADMIN_USERS))) {
      return true
    } else {
      return false
    }
  }
  public async view(user: any, AdminUser: AdminUser) {
    if (user.id === AdminUser.id) {
      return true
    }
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_ADMIN_USERS))) {
      return true
    } else {
      return false
    }
  }
  public async create(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_ADMIN_USERS))) {
      return true
    } else {
      return false
    }
  }
  public async update(user: any, AdminUser: AdminUser) {
    if (user.id === AdminUser.id) {
      return true
    }
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_ADMIN_USERS))) {
      return true
    } else {
      return false
    }
  }
  public async delete(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_ADMIN_USERS))) {
      return true
    } else {
      return false
    }
  }

  public async updatePassword(user: any, AdminUser: AdminUser) {
    if (user.id === AdminUser.id) {
      return true
    }
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_ADMIN_USERS))) {
      return true
    } else {
      return false
    }
  }
}
