import { NotificationContract } from '@ioc:Verful/Notification'
import { NotificationTypes } from 'App/Helpers/enums'
import SupportTicket from 'App/Models/helpcenter/SupportTicket'
import User from 'App/Models/user/User'

export default class SupportTicketNotification implements NotificationContract {
  constructor(private ticket: SupportTicket) {}
  public via(notifiable) {
    return 'database' as const
  }

  public toDatabase(notifiable: User) {
    return {
      type: NotificationTypes.NEW_SUPPORT_TICKET,
      title: 'New Support ticket opened',
      id: this.ticket.id,
    }
  }
}
