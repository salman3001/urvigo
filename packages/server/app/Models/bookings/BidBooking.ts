import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, afterCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import VendorUser from '../vendorUser/VendorUser'
import User from '../user/User'
import { NotificationTypes, OrderStatus } from 'App/Helpers/enums'

export default class BidBooking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public qty: number

  @column()
  public price: string | number

  @column()
  public userId: number

  @column()
  public vendorUserId: number

  @column({ prepare: (v) => JSON.stringify(v) })
  public bookingDetail: {}

  @column({ prepare: (v) => JSON.stringify(v) })
  public paymentDetail: {}

  @column({ prepare: (v) => JSON.stringify(v) })
  public history: { date_time: DateTime; event: string; remarks: string }[]

  @column()
  public status: OrderStatus

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => VendorUser)
  public vendorUser: BelongsTo<typeof VendorUser>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @afterCreate()
  public static async notifyUser(booking: BidBooking) {
    await booking.load('user')
    await booking.load('vendorUser')

    booking.user.related('notifications').create({
      data: {
        type: NotificationTypes.BOOKING_CREATED,
        message: 'You Service has booked Successfully',
        meta: {
          bookingId: booking.id,
        },
      },
    })

    booking.vendorUser.related('notifications').create({
      data: {
        type: NotificationTypes.BOOKING_CREATED,
        message: 'Congratulation! Someone has just booked your service.',
        meta: {
          bookingId: booking.id,
        },
      },
    })
  }
}
