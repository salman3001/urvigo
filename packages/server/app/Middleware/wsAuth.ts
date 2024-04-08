import User from 'App/Models/user/User'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import AdminUser from 'App/Models/adminUser/AdminUser'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import { userTypes } from 'App/Helpers/enums'

const wsAuth = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError | undefined) => void
) => {
  const token = socket.handshake.auth['socket-token']
  const userId = socket.handshake.auth['user-id']
  const userType = socket.handshake.auth['user-type']

  if (!token || !userId || !userType) {
    next(new Error('Unauthorized'))
    return
  }

  if (userType == userTypes.USER) {
    const user = await User.findBy('id', userId)

    if (user?.socketToken == token) {
      socket.handshake.auth.user = user
      next()
      return
    }
  }

  if (userType == userTypes.VENDER) {
    const user = await VendorUser.findBy('id', userId)

    if (user?.socketToken == token) {
      socket.handshake.auth.user = user
      next()
      return
    }
  }

  if (userType == userTypes.ADMIN) {
    const user = await AdminUser.findBy('id', userId)

    if (user?.socketToken == token) {
      socket.handshake.auth.user = user
      next()
      return
    }
  }

  next(new Error('Unauthorized'))
}

export default wsAuth
