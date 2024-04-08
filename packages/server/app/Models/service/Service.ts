import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  ManyToMany,
  beforeDelete,
  belongsTo,
  column,
  hasMany,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import ServiceCategory from './ServiceCategory'
import ServiceSubcategory from './ServiceSubcategory'
import ServiceTag from './ServiceTag'
import Seo from '../Seo'
import Image from '../Image'
import Faq from '../Faq'
import Review from '../Review'
import ServiceVariant from './ServiceVariant'
import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Coupon from '../orders/Coupon'
import VendorUser from '../vendorUser/VendorUser'
import BigNumber from 'bignumber.js'
import {
  responsiveAttachment,
  ResponsiveAttachmentContract,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'

export default class Service extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public shortDesc: string

  @column()
  public longDesc: string

  @column()
  public isActive: boolean

  @column()
  public locationSpecific: boolean

  @column()
  public geoLocation: string

  @column({
    serialize: (v) => new BigNumber(v || 0).toFixed(1),
  })
  public avgRating: string | number

  @attachment({
    folder: 'service/videos',
  })
  public video: AttachmentContract

  @responsiveAttachment({
    folder: 'services/thumbnails',
    preComputeUrls: true,
    forceFormat: 'webp',
    responsiveDimensions: true,
    breakpoints: {
      small: 'off',
      large: 'off',
      medium: 'off',
    },
  })
  public thumbnail: ResponsiveAttachmentContract

  @column()
  public vendorUserId: number

  @column()
  public serviceCategoryId: number

  @column()
  public serviceSubcategoryId: number

  @belongsTo(() => VendorUser)
  public vendorUser: BelongsTo<typeof VendorUser>

  @belongsTo(() => ServiceCategory)
  public serviceCategory: BelongsTo<typeof ServiceCategory>

  @belongsTo(() => ServiceSubcategory)
  public serviceSubcategory: BelongsTo<typeof ServiceSubcategory>

  @hasMany(() => Image)
  public images: HasMany<typeof Image>

  @hasOne(() => Seo)
  public seo: HasOne<typeof Seo>

  @hasMany(() => Faq)
  public faq: HasMany<typeof Faq>

  @manyToMany(() => ServiceTag, {
    pivotTable: 'service_tags_pivot',
  })
  public tags: ManyToMany<typeof ServiceTag>

  @hasMany(() => Review)
  public reviews: HasMany<typeof Review>

  @hasMany(() => ServiceVariant)
  public variants: HasMany<typeof ServiceVariant>

  @manyToMany(() => Coupon, { pivotTable: 'service_coupons' })
  public coupons: ManyToMany<typeof Coupon>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeDelete()
  public static async deleteRelations(service: Service) {
    await service.load('images')
    await service.load('variants')

    if (service.images) {
      for (const img of service.images) {
        await img.delete()
      }
    }

    if (service.variants) {
      for (const v of service.variants) {
        await v.delete()
      }
    }
  }
}
