import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Service from '../service/Service'

export default class Wishlist extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @manyToMany(() => Service, {
    pivotTable: 'wishlist_items',
  })
  public items: ManyToMany<typeof Service>

}
