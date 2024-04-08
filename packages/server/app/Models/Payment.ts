import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { PaymentStatus } from 'App/Helpers/enums'
import Booking from './bookings/Booking'
import BidBooking from './bookings/BidBooking'
import VendorUser from './vendorUser/VendorUser'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public amount: string

  @column()
  public amountPaid: string

  @column()
  public amountDue: string

  @column()
  public currency: string

  @column()
  public status: PaymentStatus

  @column()
  public gatewayData: {}

  @column()
  public bookingId: number

  @column()
  public bidBookingId: number

  @column()
  public vendorUserId: number

  @belongsTo(() => Booking)
  public booking: BelongsTo<typeof Booking>

  @belongsTo(() => BidBooking)
  public bidBooking: BelongsTo<typeof BidBooking>

  @belongsTo(() => VendorUser)
  public vendorUSer: BelongsTo<typeof VendorUser>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
