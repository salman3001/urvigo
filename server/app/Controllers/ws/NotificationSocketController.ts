import { isAdmin } from 'App/Helpers/permissionHelpers'
import { Namespace, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export default class NotificationSocketController {
  constructor(
    private socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    private io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {}
  private room: string | null = null
  public execute() {
    this.room = this.createRoom(this.socket.handshake.auth.user)
    this.socket.join(this.room)
    this.io.to(this.room).emit('room-joined', this.room)
  }

  private createRoom(user: any): string {
    if (isAdmin(user)) {
      return `admin:${user.id}`
    } else {
      return `user:${user.id}`
    }
  }
}
