import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, afterCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { NotificationTypes, OrderStatus } from 'App/Helpers/enums'
import VendorUser from '../vendorUser/VendorUser'
import OrderGroup from './OrderGroup'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public orderGroupId: number

  @column()
  public vendorUserId: number

  @column({ prepare: (v) => JSON.stringify(v) })
  public orderDetail: Object

  @column()
  public status: OrderStatus

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => VendorUser)
  public vendor: BelongsTo<typeof VendorUser>

  @belongsTo(() => OrderGroup)
  public orderGroup: BelongsTo<typeof OrderGroup>

  @afterCreate()
  public static async notifyUsers(order: Order) {
    const vendor = await VendorUser.query().where('id', order.vendorUserId).first()

    if (vendor) {
      vendor.related('notifications').create({
        data: {
          type: NotificationTypes.ORDER_CREATED,
          message: 'New Order Receieved',
          meta: {
            orderId: order.id,
          },
        },
      })
    }
  }
}
