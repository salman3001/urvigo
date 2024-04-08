import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Cart from 'App/Models/user/Cart'
import User from 'App/Models/user/User'

export default class CartPolicy extends BasePolicy {
  public async viewList(user: User) {
    return false
  }
  public async view(user: User) {
    if (user && user instanceof User) {
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
