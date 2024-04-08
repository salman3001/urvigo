import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/user/User'
import ServiceRequirement from 'App/Models/bid/ServiceRequirement'
import { action } from '@ioc:Adonis/Addons/Bouncer'

export default class ServiceRequirmentPolicy extends BasePolicy {
  public async myList(user: User) {
    if (user instanceof User) {
      return true
    } else {
      return false
    }
  }

  @action({ allowGuest: true })
  public async viewList(user: User) {
    return true
  }

  @action({ allowGuest: true })
  public async view(user: User, serviceRequirement: ServiceRequirement) {
    return true
  }

  public async create(user: User) {
    if (user instanceof User) {
      return true
    } else {
      false
    }
  }

  public async update(user: User, serviceRequirement: ServiceRequirement) {
    if (user instanceof User && serviceRequirement.userId == user.id) {
      return true
    } else {
      return false
    }
  }

  public async delete(user: User, serviceRequirement: ServiceRequirement) {
    if (user instanceof User && serviceRequirement.userId == user.id) {
      return true
    } else {
      return false
    }
  }
}
