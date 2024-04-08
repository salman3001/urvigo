import { BaseModel, BelongsTo, afterFetch, beforeFetch, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import ServiceVariant from '../service/ServiceVariant'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public qty: number

  @column()
  public cartId: number

  @column()
  public serviceVariantId: number

  @belongsTo(() => ServiceVariant)
  public serviceVariant: BelongsTo<typeof ServiceVariant>

}
