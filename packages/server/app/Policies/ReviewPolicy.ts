import { action } from '@ioc:Adonis/Addons/Bouncer'
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Review from 'App/Models/Review'
import User from 'App/Models/user/User'

export default class ReviewPolicy extends BasePolicy {
  @action({ allowGuest: true })
  public async viewList(user: User) {
    return true
  }

  @action({ allowGuest: true })
  public async view(user: User) {
    return true
  }

  public async create(user: User) {
    if (user && user instanceof User) {
      return true
    } else {
      return false
    }
  }
  public async update(user: User) {
    return false
  }
  public async delete(authUser: User, review: Review) {
    if (review.userId === authUser.id) {
      return true
    } else {
      return false
    }
  }
}
