import { action } from '@ioc:Adonis/Addons/Bouncer'
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { permissions } from 'App/Helpers/enums'
import { hasPermission, isAdmin } from 'App/Helpers/permissionHelpers'
import Business from 'App/Models/vendorUser/VendorProfile'
import VendorUser from 'App/Models/vendorUser/VendorUser'

export default class BusinessPolicy extends BasePolicy {
  @action({ allowGuest: true })
  public async viewList(user: any) {
    return true
  }

  @action({ allowGuest: true })
  public async view(user: any) {
    return true
  }

  public async create(user: any) {
    return false
  }

  public async update(user: any, business: Business) {
    if (user instanceof VendorUser) {
      if (user.id === business.vendorUserId) {
        return true
      }
    }

    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_BUSINESS))) {
      return true
    } else {
      return false
    }
  }

  public async delete(user: any, business: Business) {
    if (user instanceof VendorUser) {
      if (user.id === business.vendorUserId) {
        return true
      }
    }

    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_BUSINESS))) {
      return true
    } else {
      return false
    }
  }
}
