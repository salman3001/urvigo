import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { permissions } from 'App/Helpers/enums'
import { hasPermission, isAdmin } from 'App/Helpers/permissionHelpers'

export default class TemplatePolicy extends BasePolicy {
  public async viewList(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TEMPLATES))) {
      return true
    } else {
      return false
    }
  }

  public async view(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TEMPLATES))) {
      return true
    } else {
      return false
    }
  }

  public async create(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TEMPLATES))) {
      return true
    } else {
      return false
    }
  }

  public async update(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TEMPLATES))) {
      return true
    } else {
      return false
    }
  }
  public async delete(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TEMPLATES))) {
      return true
    } else {
      return false
    }
  }
}
