import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/user/User'
import { hasPermission, isAdmin } from 'App/Helpers/permissionHelpers'
import { permissions } from 'App/Helpers/enums'
import AdminUser from 'App/Models/adminUser/AdminUser'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import BidBooking from 'App/Models/bookings/BidBooking'

export default class BidBookingPolicy extends BasePolicy {
  public async viewList(user: User | AdminUser) {
    if (
      isAdmin(user) &&
      (await hasPermission(user as AdminUser, permissions.MANAGE_BID_BOOKINGS))
    ) {
      return true
    } else {
      false
    }
  }

  public async myList(user: User | AdminUser | VendorUser) {
    if (user instanceof User || user instanceof VendorUser) {
      return true
    } else {
      false
    }
  }

  public async view(user: User, bidBooking: BidBooking) {
    if (user instanceof User && bidBooking.userId == user.id) {
      return true
    } else if (user instanceof VendorUser && bidBooking.userId == user.id) {
      return true
    } else {
      return false
    }
  }
  public async create(user: User) {
    if (user instanceof User) {
      return true
    } else {
      return false
    }
  }
  public async update(user: User, bidBooking: BidBooking) {
    if (user instanceof VendorUser && bidBooking.userId == user.id) {
      return true
    } else {
      return false
    }
  }
  public async delete(user: User, bidBooking: BidBooking) {
    return false
  }
}
