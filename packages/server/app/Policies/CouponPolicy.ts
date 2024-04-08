import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { CouponType, permissions } from 'App/Helpers/enums'
import { hasPermission, isAdmin } from 'App/Helpers/permissionHelpers'
import Coupon from 'App/Models/orders/Coupon'
import AdminUser from 'App/Models/adminUser/AdminUser'
import User from 'App/Models/user/User'
import VendorUser from 'App/Models/vendorUser/VendorUser'

export default class CouponPolicy extends BasePolicy {
  public async viewList(user: User | VendorUser | AdminUser) {
    if (user instanceof VendorUser) {
      return true
    } else if (
      isAdmin(user) &&
      (await hasPermission(user as AdminUser, permissions.MANAGE_COUPONS))
    ) {
      return true
    } else {
      return false
    }
  }

  public async view(user: User, coupon: Coupon) {
    const isValidVandor =
      user instanceof VendorUser &&
      coupon.couponType == CouponType.VENDOR &&
      coupon.vendorUserId == user.id

    const isValidAdmin =
      isAdmin(user) &&
      (await hasPermission(user as unknown as AdminUser, permissions.MANAGE_COUPONS)) &&
      coupon.couponType == CouponType.ADMIN

    if (isValidAdmin) {
      return true
    } else if (isValidVandor) {
      return true
    } else {
      return false
    }
  }

  public async create(user: User) {
    const isVandor = user instanceof VendorUser
    const isValidAdmin =
      isAdmin(user) &&
      (await hasPermission(user as unknown as AdminUser, permissions.MANAGE_COUPONS))

    if (isVandor || isValidAdmin) {
      return true
    } else {
      return false
    }
  }

  public async update(user: User, coupon: Coupon) {
    const isValidVandor =
      user instanceof VendorUser &&
      coupon.couponType == CouponType.VENDOR &&
      coupon.vendorUserId == user.id

    const isValidAdmin =
      isAdmin(user) &&
      (await hasPermission(user as unknown as AdminUser, permissions.MANAGE_COUPONS)) &&
      coupon.couponType == CouponType.ADMIN

    if (isValidAdmin) {
      return true
    } else if (isValidVandor) {
      return true
    } else {
      return false
    }
  }

  public async delete(user: User, coupon: Coupon) {
    const isValidVandor =
      user instanceof VendorUser &&
      coupon.couponType == CouponType.VENDOR &&
      coupon.vendorUserId == user.id

    const isValidAdmin =
      isAdmin(user) &&
      (await hasPermission(user as unknown as AdminUser, permissions.MANAGE_COUPONS)) &&
      coupon.couponType == CouponType.ADMIN

    if (isValidAdmin) {
      return true
    } else if (isValidVandor) {
      return true
    } else {
      return false
    }
  }
}
