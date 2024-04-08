import { action } from '@ioc:Adonis/Addons/Bouncer'
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { permissions } from 'App/Helpers/enums'
import { hasPermission, isAdmin } from 'App/Helpers/permissionHelpers'

export default class ContactMessagePolicy extends BasePolicy {
  public async viewList(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CONTACT_MESSAGES))) {
      return true
    } else {
      return false
    }
  }

  public async view(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CONTACT_MESSAGES))) {
      return true
    } else {
      return false
    }
  }

  @action({ allowGuest: true })
  public async create(user: any) {
    return true
  }

  public async update(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CONTACT_MESSAGES))) {
      return true
    } else {
      return false
    }
  }
  public async delete(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CONTACT_MESSAGES))) {
      return true
    } else {
      return false
    }
  }
}
