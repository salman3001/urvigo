import ChatSocketController from 'App/Controllers/ws/ChatSocketController'
import NotificationSocketController from 'App/Controllers/ws/NotificationSocketController'
import TicketChatSocketController from 'App/Controllers/ws/TicketChatSocketController'
import wsAuth from 'App/Middleware/wsAuth'
import Ws from 'App/services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */

const homeSocket = Ws.io.of('/').use(wsAuth)
const userSocketIo = Ws.io.of('/notifications/').use(wsAuth)
const ticketChatIo = Ws.io.of('/ticket_chat/').use(wsAuth)
const ChatIo = Ws.io.of('/chat/').use(wsAuth)

ticketChatIo.on('connection', (socket) => {
  const controller = new TicketChatSocketController(socket, ticketChatIo)
  controller.execute()
})

userSocketIo.on('connection', (socket) => {
  const controller = new NotificationSocketController(socket, userSocketIo)
  controller.execute()
})

ChatIo.on('connection', (socket) => {
  const controller = new ChatSocketController(socket, ChatIo)
  controller.execute()
})
