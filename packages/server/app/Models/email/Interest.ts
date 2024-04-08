import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Subscriber from './Subscriber'
import Campaign from './Campaign'

export default class Interest extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @manyToMany(() => Subscriber, {
    pivotTable: 'subscriber_interests_pivot',
  })
  public subscribers: ManyToMany<typeof Subscriber>

  @manyToMany(() => Campaign, {
    pivotTable: 'campaign_interests_pivot',
  })
  public campaigns: ManyToMany<typeof Campaign>
}
