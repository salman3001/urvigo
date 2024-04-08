import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import AdminUser from '../adminUser/AdminUser'
import VendorUser from '../vendorUser/VendorUser'
import User from '../user/User'

export default class ConversationParticipant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userIdentifier: string

  @column()
  public userId: number

  @column()
  public vendorUserId: number

  @column()
  public adminUserId: number

  @belongsTo(() => AdminUser)
  public adminUser: BelongsTo<typeof AdminUser>

  @belongsTo(() => VendorUser)
  public vendorUser: BelongsTo<typeof VendorUser>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
