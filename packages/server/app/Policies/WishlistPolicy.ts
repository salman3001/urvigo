import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import AdminUser from 'App/Models/adminUser/AdminUser'
import User from 'App/Models/user/User'

export default class WishlistPolicy extends BasePolicy {
  public async viewList(user: User) {
    return false
  }

  public async view(user: User | AdminUser) {
    if (user instanceof User || user instanceof AdminUser) {
      return true
    } else {
      return false
    }
  }
  public async create(user: User) {
    // if (user && user instanceof User) {
    //   return true
    // } else {
    //   return false
    // }
    return false
  }

  public async update(user: User) {
    if (user && user instanceof User) {
      return true
    } else {
      return false
    }
  }

  public async delete(user: User) {
    if (user && user instanceof User) {
      return true
    } else {
      return false
    }
  }
}
