import { DateTime } from 'luxon'
import { BaseModel, hasOne, column, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { MediaTypes } from 'App/Helpers/enums'
import Image from './Image'
import Video from './Video'

export default class Media extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: MediaTypes

  @hasOne(() => Image)
  image: HasOne<typeof Image>

  @hasOne(() => Video)
  video: HasOne<typeof Video>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
