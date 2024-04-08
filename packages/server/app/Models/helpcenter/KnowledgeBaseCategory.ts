import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import KnowledgeBaseContent from './KnowledgeBaseContent'
import Language from '../Language'

export default class KnowledgeBaseCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public languageId: number

  @belongsTo(() => Language)
  public language: BelongsTo<typeof Language>

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public order: number

  @column()
  public isActive: boolean

  @column()
  public metaTitle: string

  @column()
  public metaDesc: string

  @column()
  public metaKeywords: string

  @hasMany(() => KnowledgeBaseContent)
  public contents: HasMany<typeof KnowledgeBaseContent>
}
