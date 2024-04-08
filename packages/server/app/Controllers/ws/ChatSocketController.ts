import AdminUser from 'App/Models/adminUser/AdminUser'
import Conversation from 'App/Models/chat/Conversation'
import User from 'App/Models/user/User'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import { Namespace, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export default class ChatSocketController {
  constructor(
    private socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    private io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {}

  private room: string | null = null

  public async execute() {
    this.room = await this.createChatRoom(this.socket.handshake.auth?.user)

    if (await this.isAllowed(this.socket.handshake.auth?.user)) {
      this.room && this.socket.join(this.room)
      this.room && this.io.to(this.room).emit('room-joined', this.room)
    }
  }

  private async createChatRoom(user: AdminUser | User | VendorUser): Promise<string | null> {
    return `${user.userType}-${user.id}-chats`
  }

  private async isAllowed(user: any): Promise<boolean> {
    // if (this.conversation && this.ticket.userId === user.id) {
    //   return true
    // }

    // if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TICKETS))) {
    //   return true
    // }

    return true
  }
}
