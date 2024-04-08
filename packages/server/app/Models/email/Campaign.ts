import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasOne,
  ManyToMany,
  belongsTo,
  column,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Template from './Template'
import CampaignType from './CampaignType'
import Interest from './Interest'

export default class Campaign extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public subject: string

  @column()
  public fromName: string

  @column()
  public fromEmail: string

  @column()
  public replyTo: string

  @column()
  public status: boolean

  @column.dateTime()
  public deliveryDateTime: DateTime

  @column()
  public campaignTypeId: number

  @belongsTo(() => CampaignType)
  public campaignType: BelongsTo<typeof CampaignType>

  @manyToMany(() => Interest, {
    pivotTable: 'campaign_interests_pivot',
  })
  public interests: ManyToMany<typeof Interest>

  @hasOne(() => Template)
  public template: HasOne<typeof Template>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
