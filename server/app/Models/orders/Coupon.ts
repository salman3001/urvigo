import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { CouponType, DiscountType } from 'App/Helpers/enums'
import VendorUser from '../vendorUser/VendorUser'
import Service from '../service/Service'

export default class Coupon extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public desc: string

  @column()
  public isActive: boolean

  @column()
  public couponType: CouponType

  @column()
  public discountType: DiscountType

  @column()
  public discountFlat: number

  @column()
  public discountPercentage: number

  @column()
  public maxUsers: number

  @column()
  public minPurchaseAmount: number

  @column.dateTime({ autoCreate: true })
  public expiredAt: DateTime

  @column.dateTime({ autoCreate: true })
  public validFrom: DateTime

  @column()
  public vendorUserId: number | null

  @belongsTo(() => VendorUser)
  public vendor: BelongsTo<typeof VendorUser>

  @manyToMany(() => Service, { pivotTable: 'service_coupons' })
  public services: ManyToMany<typeof Service>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
