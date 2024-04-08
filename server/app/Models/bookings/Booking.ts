import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import VendorUser from '../vendorUser/VendorUser'
import User from '../user/User'
import { OrderStatus } from 'App/Helpers/enums'
import ServiceVariant from '../service/ServiceVariant'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public serviceVariantId: number

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

  @belongsTo(() => ServiceVariant)
  public serviceVariant: BelongsTo<typeof ServiceVariant>
}
