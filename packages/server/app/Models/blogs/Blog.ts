import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import BlogCategory from './BlogCategory'
import Language from '../Language'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import VendorUser from '../vendorUser/VendorUser'
import AdminUser from '../adminUser/AdminUser'

export default class Blog extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public slug: string

  @responsiveAttachment({
    folder: 'blogs',
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

  @manyToMany(() => BlogCategory, {
    pivotTable: 'blog_categories_pivot',
  })
  public category: ManyToMany<typeof BlogCategory>

  @belongsTo(() => VendorUser)
  public vendorUser: BelongsTo<typeof VendorUser>

  @belongsTo(() => AdminUser)
  public adminUser: BelongsTo<typeof AdminUser>

  @column()
  public languageId: number

  @column()
  public adminUserId: number

  @column()
  public vendorUserId: number

  @belongsTo(() => Language)
  public language: BelongsTo<typeof Language>

  @column()
  public shortDesc: string

  @column()
  public longDesc: string

  @column()
  public isPublished: boolean

  @column()
  public metaTitle: string

  @column()
  public metaKeywords: string

  @column()
  public metaDesc: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
