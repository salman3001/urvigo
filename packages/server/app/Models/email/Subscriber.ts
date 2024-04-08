import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Interest from './Interest'

export default class Subscriber extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  firstName: string

  @column()
  lastName: string

  @column()
  email: string

  @column()
  phone: string

  @column()
  status: boolean

  @manyToMany(() => Interest, {
    pivotTable: 'subscriber_interests_pivot',
  })
  public interests: ManyToMany<typeof Interest>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
