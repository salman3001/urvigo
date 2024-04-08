import { permissions } from 'App/Helpers/enums'
import { hasPermission } from 'App/Helpers/permissionHelpers'
import { isAdmin } from 'App/Helpers/permissionHelpers'
import SupportTicket from 'App/Models/helpcenter/SupportTicket'
import { Namespace, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export default class TicketChatSocketController {
  constructor(
    private socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    private io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {}
  private ticket: null | SupportTicket = null
  private room: string | null = null

  public async execute() {
    this.socket.on('join-chat', async (ticketId: number) => {
      this.room = await this.createChatRoom(ticketId)

      if (await this.isAllowed(this.socket.handshake.auth?.user)) {
        this.room && this.socket.join(this.room)
        this.room && this.io.to(this.room).emit('room-joined', this.room)
      }
    })
  }

  private async createChatRoom(ticketId: number): Promise<string | null> {
    const ticket = await SupportTicket.findBy('id', ticketId)

    if (ticket) {
      this.ticket = ticket
      return `ticket-chat-${ticket.id}`
    } else {
      return null
    }
  }

  private async isAllowed(user: any): Promise<boolean> {
    if (this.ticket && this.ticket.userId === user.id) {
      return true
    }

    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TICKETS))) {
      return true
    }

    return false
  }
}
