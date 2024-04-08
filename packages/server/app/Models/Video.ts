import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public mediaId: number

  @attachment({
    folder: 'videos',
    preComputeUrl: true,
  })
  file: AttachmentContract

  @column()
  public serviceId: number
}
