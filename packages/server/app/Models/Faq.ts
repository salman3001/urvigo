import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Faq extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public quest: string

  @column()
  public ans: string

  @column()
  public serviceSubcategoryId: number

  @column()
  public serviceCategoryId: number

  @column()
  public serviceId: number

  @column()
  public serviceTagId: number

  @column()
  public vendorProfileId: number
}
