import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/user/User'
import Bid from 'App/Models/bid/Bid'
import VendorUser from 'App/Models/vendorUser/VendorUser'

export default class BidPolicy extends BasePolicy {
  public async viewList(user: User) {
    return true
  }

  public async view(user: User, bid: Bid) {
    return true
  }
  public async create(user: User) {
    if (user instanceof VendorUser) {
      return true
    } else {
      return false
    }
  }

  public async negotiate(user: User) {
    if (user instanceof User) {
      return true
    } else {
      return false
    }
  }

  public async update(user: User, bid: Bid) {
    if (user instanceof VendorUser && bid.vendorUserId == user.id) {
      return true
    } else {
      return false
    }
  }

  public async delete(user: User, bid: Bid) {
    if (user instanceof VendorUser && bid.vendorUserId == user.id) {
      return true
    } else {
      return false
    }
  }
}
