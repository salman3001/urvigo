import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  belongsTo,
  column,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Seo from '../Seo'
import Social from '../Social'
import Faq from '../Faq'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Image from '../Image'
import VendorUser from './VendorUser'
import Address from '../address/Address'

export default class VendorProfile extends BaseModel {
  public serializeExtras = true
  @column({ isPrimary: true })
  public id: number

  @column()
  public shortDesc: string

  @column()
  public longDesc: string

  @column()
  public isActive: boolean

  @responsiveAttachment({
    folder: 'vendor',
    preComputeUrls: true,
    forceFormat: 'webp',
    responsiveDimensions: true,
    breakpoints: {
      small: 'off',
      large: 'off',
      medium: 'off',
    },
  })
  public avatar: ResponsiveAttachmentContract

  @responsiveAttachment({
    folder: 'business/logos',
    preComputeUrls: true,
    forceFormat: 'webp',
    responsiveDimensions: true,
    breakpoints: {
      small: 'off',
      large: 'off',
      medium: 'off',
    },
  })
  public logo: ResponsiveAttachmentContract

  @column()
  public vendorUserId: number

  @hasMany(() => Image)
  public images: HasMany<typeof Image>

  @hasOne(() => Seo)
  public seo: HasOne<typeof Seo>

  @hasOne(() => Social)
  public social: HasOne<typeof Social>

  @hasMany(() => Faq)
  public faq: HasMany<typeof Faq>

  @hasMany(() => Address)
  public addresses: HasMany<typeof Address>

  @belongsTo(() => VendorUser)
  public vendor: BelongsTo<typeof VendorUser>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
