import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Campaign from './Campaign'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'

export default class Template extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public desc: string

  @column()
  public content: string

  @column()
  public campaignId: number

  @responsiveAttachment({
    folder: 'templates',
    preComputeUrls: true,
    forceFormat: 'webp',
    responsiveDimensions: true,
    breakpoints: {
      small: 'off',
      large: 'off',
      medium: 'off',
    },
  })
  public thumbnail: ResponsiveAttachmentContract

  @belongsTo(() => Campaign)
  public campaign: BelongsTo<typeof Campaign>
}
