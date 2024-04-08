import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, afterCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ServiceRequirement from './ServiceRequirement'
import VendorUser from '../vendorUser/VendorUser'
import { NotificationTypes } from 'App/Helpers/enums'

export default class Bid extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public offeredPrice: number | string

  @column()
  public message: string

  @column({ prepare: (v) => JSON.stringify(v) })
  public negotiateHistory: {
    date_time: DateTime
    asked_price: string
    message: string
    accepted: boolean
  }[]

  @column()
  public serviceRequirementId: number

  @column()
  public vendorUserId: number

  @belongsTo(() => VendorUser)
  public vendorUser: BelongsTo<typeof VendorUser>

  @belongsTo(() => ServiceRequirement)
  public serviceRequirement: BelongsTo<typeof ServiceRequirement>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static async notifyUser(bid: Bid) {
    await bid.load('serviceRequirement', (s) => {
      s.preload('user')
    })

    await bid.serviceRequirement.user.related('notifications').create({
      data: {
        type: NotificationTypes.BID_RECIEVED,
        message: 'Some one added a bid on your service requirement',
        meta: {
          serviceRequirementId: bid.serviceRequirement.id,
        },
      },
    })
  }
}
