import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  HasOne,
  ManyToMany,
  column,
  computed,
  hasMany,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Faq from '../Faq'
import Seo from '../Seo'
import Service from './Service'
import ServiceSubcategory from './ServiceSubcategory'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import VendorUser from '../vendorUser/VendorUser'

export default class ServiceCategory extends BaseModel {
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
  public status: boolean

  @responsiveAttachment({
    folder: 'service-category',
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

  @hasMany(() => ServiceSubcategory)
  public subCategory: HasMany<typeof ServiceSubcategory>

  @hasMany(() => Faq)
  public faqs: HasMany<typeof Faq>

  @hasMany(() => Service)
  public services: HasMany<typeof Service>

  @hasOne(() => Seo)
  public seo: HasOne<typeof Seo>

  @manyToMany(() => VendorUser, {
    pivotTable: 'vendor_subscribed_categories',
  })
  public subscribedVendors: ManyToMany<typeof VendorUser>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
