import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import VendorUser from '../vendorUser/VendorUser'
import User from '../user/User'
import { OrderStatus } from 'App/Helpers/enums'

export default class BidOrder extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public vendorUserId: number

  @column()
  public userId: number

  @column()
  public price: string | number

  @column({ prepare: (v) => JSON.stringify(v) })
  public orderDetail: {}

  @column()
  public status: OrderStatus

  @column({ prepare: (v) => JSON.stringify(v) })
  public paymentDetail: {}

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => VendorUser)
  public vendorUser: BelongsTo<typeof VendorUser>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
