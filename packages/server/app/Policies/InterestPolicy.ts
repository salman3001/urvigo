import { action } from '@ioc:Adonis/Addons/Bouncer'
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { permissions } from 'App/Helpers/enums'
import { hasPermission, isAdmin } from 'App/Helpers/permissionHelpers'

export default class InterestPolicy extends BasePolicy {
  @action({ allowGuest: true })
  public async viewList(user: any) {
    return true
  }

  @action({ allowGuest: true })
  public async view(user: any) {
    return true
  }

  public async create(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_INTERESTS))) {
      return true
    } else {
      return false
    }
  }
  public async update(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_INTERESTS))) {
      return true
    } else {
      return false
    }
  }
  public async delete(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_INTERESTS))) {
      return true
    } else {
      return false
    }
  }
}
