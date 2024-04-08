import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'

export default class Image extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public mediaId: number

  @responsiveAttachment({
    folder: 'other',
    preComputeUrls: true,
    forceFormat: 'webp',
    responsiveDimensions: true,
    breakpoints: {
      small: 'off',
      large: 'off',
      medium: 'off',
    },
  })
  public file: ResponsiveAttachmentContract

  @column()
  public serviceId: number

  @column()
  public vendorProfileId: number

  @column()
  public serviceRequirementId: number
}
