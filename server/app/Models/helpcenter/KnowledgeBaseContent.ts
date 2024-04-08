import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import KnowledgeBaseCategory from './KnowledgeBaseCategory'
import Language from '../Language'

export default class KnowledgeBaseContent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public slug: string

  @column()
  public isActive: boolean

  @column()
  public order: number

  @column()
  public knowledgeBaseCategoryId: number

  @belongsTo(() => KnowledgeBaseCategory)
  public category: BelongsTo<typeof KnowledgeBaseCategory>

  @column()
  public languageId: number

  @belongsTo(() => Language)
  public language: BelongsTo<typeof Language>

  @column()
  public content: string

  @column()
  public metaTitle: string
  @column()
  public metaDesc: string
  @column()
  public metaKeywords: string
}
