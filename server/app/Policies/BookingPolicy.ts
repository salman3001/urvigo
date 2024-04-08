import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/user/User'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import AdminUser from 'App/Models/adminUser/AdminUser'
import { hasPermission, isAdmin } from 'App/Helpers/permissionHelpers'
import { permissions } from 'App/Helpers/enums'
import Booking from 'App/Models/bookings/Booking'

export default class BookingPolicy extends BasePolicy {
  public async viewList(user: User | VendorUser | AdminUser) {
    if (isAdmin(user) && (await hasPermission(user as AdminUser, permissions.MANAGE_BOOKINGS))) {
      return true
    } else {
      return false
    }
  }

  public async customerList(user: User | VendorUser | AdminUser) {
    if (user instanceof User) {
      return true
    } else {
      return false
    }
  }

  public async vendorList(user: User | VendorUser | AdminUser) {
    if (user instanceof VendorUser) {
      return true
    } else {
      return false
    }
  }

  public async view(user: User, booking: Booking) {
    if (
      isAdmin(user) &&
      (await hasPermission(user as unknown as AdminUser, permissions.MANAGE_BOOKINGS))
    ) {
      return true
    } else if (user instanceof User && user.id == booking.userId) {
      return true
    } else if (user instanceof VendorUser && user.id == booking.vendorUserId) {
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
  public async update(user: User, booking: Booking) {
    if (
      isAdmin(user) &&
      (await hasPermission(user as unknown as AdminUser, permissions.MANAGE_BOOKINGS))
    ) {
      return true
    } else if (user instanceof VendorUser && user.id == booking.vendorUserId) {
      return true
    } else {
      return false
    }
  }
  public async delete(user: User) {
    if (
      isAdmin(user) &&
      (await hasPermission(user as unknown as AdminUser, permissions.MANAGE_BOOKINGS))
    ) {
      return true
    } else {
      return false
    }
  }
}
