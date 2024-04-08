import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  afterCreate,
  belongsTo,
  column,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { NotificationTypes } from 'App/Helpers/enums'
import User from '../user/User'
import Order from './Order'

export default class OrderGroup extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column({ prepare: (v) => JSON.stringify(v) })
  public orderGroupDetail: {
    grand_total_without_discount: string
    grand_total_discount: string
    grand_total_coupon_discount: string
    grand_total: string
  }

  @column({ prepare: (v) => JSON.stringify(v) })
  public paymentDetail: {}

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Order)
  public orders: HasMany<typeof Order>

  @afterCreate()
  public static async notifyUsers(orderGroup: OrderGroup) {
    const user = await User.query().where('id', orderGroup.userId).first()

    if (user) {
      user.related('notifications').create({
        data: {
          type: NotificationTypes.ORDER_CREATED,
          message: 'New Order Created',
          meta: {
            orderId: orderGroup.id,
          },
        },
      })
    }
  }
}
