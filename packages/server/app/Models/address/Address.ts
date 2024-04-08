import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public address: string

  @column()
  public geoLocation: string

  @column()
  public userProfileId: number

  @column()
  public vendorProfileId: number
}
