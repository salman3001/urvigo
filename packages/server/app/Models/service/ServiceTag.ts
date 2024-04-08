import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  HasOne,
  ManyToMany,
  column,
  hasMany,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Faq from '../Faq'
import Seo from '../Seo'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Service from './Service'
import ServiceRequirement from '../bid/ServiceRequirement'

export default class ServiceTag extends BaseModel {
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
    folder: 'service-tag',
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

  @manyToMany(() => Service, {
    pivotTable: 'service_tags_pivot',
  })
  public services: ManyToMany<typeof Service>

  @manyToMany(() => ServiceRequirement, {
    pivotTable: 'service_requirement_tags_pivot',
  })
  public serviceRequirements: ManyToMany<typeof ServiceRequirement>

  @hasMany(() => Faq)
  public faqs: HasMany<typeof Faq>

  @hasOne(() => Seo)
  public seo: HasOne<typeof Seo>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
