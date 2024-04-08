import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/user/User'
import Conversation from 'App/Models/chat/Conversation'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import AdminUser from 'App/Models/adminUser/AdminUser'
import { userTypes } from 'App/Helpers/enums'

export default class ConversationPolicy extends BasePolicy {
  public async viewList(user: User) {
    return true
  }

  public async view(user: User | VendorUser | AdminUser, conversation: Conversation) {
    let isValidParticipant = false
    if (user instanceof User) {
      const identifier = `${userTypes.USER}-${user.id}`
      isValidParticipant = conversation.participantOneIdentifier === identifier || conversation.participantTwoIdentifier === identifier
    }

    if (user instanceof VendorUser) {
      const identifier = `${userTypes.VENDER}-${user.id}`
      isValidParticipant = conversation.participantOneIdentifier === identifier || conversation.participantTwoIdentifier === identifier
    }

    if (user instanceof AdminUser) {
      const identifier = `${userTypes.ADMIN}-${user.id}`
      isValidParticipant = conversation.participantOneIdentifier === identifier || conversation.participantTwoIdentifier === identifier
    }

    if (isValidParticipant) {
      return true
    } else {
      return false
    }
  }

  public async create(user: User) {
    return true
  }

  public async update(user: User, conversation: Conversation) {
    let isValidParticipant = false
    if (user instanceof User) {
      const identifier = `${userTypes.USER}-${user.id}`
      isValidParticipant = conversation.participantOneIdentifier === identifier || conversation.participantTwoIdentifier === identifier
    }

    if (user instanceof VendorUser) {
      const identifier = `${userTypes.VENDER}-${user.id}`
      isValidParticipant = conversation.participantOneIdentifier === identifier || conversation.participantTwoIdentifier === identifier
    }

    if (user instanceof AdminUser) {
      const identifier = `${userTypes.ADMIN}-${user.id}`
      isValidParticipant = conversation.participantOneIdentifier === identifier || conversation.participantTwoIdentifier === identifier
    }

    if (isValidParticipant) {
      return true
    } else {
      return false
    }
  }
  public async delete(user: User, conversation: Conversation) {
    return false
  }
}
