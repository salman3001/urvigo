import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  ManyToMany,
  belongsTo,
  column,
  hasMany,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Social from './Social'
import Address from './address/Address'
import Language from './Language'
import Skill from './user/Skill'
import User from './user/User'

export default class UserProfile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @responsiveAttachment({
    folder: 'user',
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

  @column()
  public userId: number

  @column()
  public adminUserId: number

  @column()
  public vendorUserId: number

  @column({
    prepare: (v: any) => JSON.stringify(v),
  })
  public notificationSetting: Object

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasOne(() => Social)
  public social: HasOne<typeof Social>

  @hasMany(() => Address)
  public addresses: HasMany<typeof Address>

  @manyToMany(() => Language, {
    pivotColumns: ['proficiency'],
    pivotTable: 'user_languages',
  })
  public languages: ManyToMany<typeof Language>

  @manyToMany(() => Skill, {
    pivotTable: 'user_skills',
  })
  public skills: ManyToMany<typeof Skill>
}
