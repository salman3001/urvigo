import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/user/User'

export default class CartItemPolicy extends BasePolicy {
  public async viewList(user: User) {}
  public async view(user: User, user: User) {}
  public async create(user: User) {}
  public async update(user: User, user: User) {}
  public async delete(user: User, user: User) {}
}
