import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Campaign from './Campaign'

export default class CampaignType extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @hasMany(() => Campaign)
  public campaign: HasMany<typeof Campaign>
}
