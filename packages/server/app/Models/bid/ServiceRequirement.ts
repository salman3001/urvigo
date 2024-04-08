import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  ManyToMany,
  afterCreate,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import ServiceCategory from '../service/ServiceCategory'
import User from '../user/User'
import Bid from './Bid'
import { NotificationTypes } from 'App/Helpers/enums'
import VendorUser from '../vendorUser/VendorUser'
import ServiceTag from '../service/ServiceTag'
import Image from '../Image'

export default class ServiceRequirement extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public desc: string

  @column()
  public budgetUnit: string

  @column()
  public budget: string | number

  @column.dateTime()
  public expiresAt: DateTime

  @column()
  public location: string

  @column()
  public urgent: boolean

  @column()
  public userId: number

  @column()
  public serviceCategoryId: number

  @column()
  public acceptedBidId: number | null

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => ServiceCategory)
  public serviceCategory: BelongsTo<typeof ServiceCategory>

  @hasMany(() => Bid)
  public recievedBids: HasMany<typeof Bid>

  @hasMany(() => Image)
  public images: HasMany<typeof Image>

  @manyToMany(() => ServiceTag, {
    pivotTable: 'service_requirement_tags_pivot',
  })
  public tags: ManyToMany<typeof ServiceTag>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static async notifyVendor(serviceRequirement: ServiceRequirement) {
    const categoryId = serviceRequirement.serviceCategoryId

    const vendors = await VendorUser.query().whereHas('subscribedCategories', (b) => {
      b.where('service_category_id', categoryId)
    })

    for (const vendor of vendors) {
      await vendor.related('notifications').create({
        data: {
          type: NotificationTypes.SERVICE_REQUIREMENT_ADDED,
          message: 'New Service Requirement Added',
          meta: {
            id: serviceRequirement.id,
            title: serviceRequirement.title,
          },
        },
      })
    }
  }
}
