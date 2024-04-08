// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Media from 'App/Models/Media'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MediaTypes } from 'App/Helpers/enums'
import { schema } from '@ioc:Adonis/Core/Validator'
import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import BaseApiController from './BaseApiController'

export default class MediaController extends BaseApiController {
  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('MediaPolicy').authorize('create')
    const payload = await this.validateRequest(request)

    const media = await Media.create({ type: payload.type, name: payload.name })

    if (payload.image) {
      await media
        .related('image')
        .create({ file: await ResponsiveAttachment.fromFile(payload.image) })
    }

    if (payload.video) {
      await media.related('video').create({ file: Attachment.fromFile(payload.video) })
    }

    return response.custom({
      message: 'Media Added Successfully',
      code: 201,
      data: media,
      success: true,
    })
  }

  public async update({ params, request, response, bouncer }: HttpContextContract): Promise<void> {
    await bouncer.with('MediaPolicy').authorize('update')
    const id = +params.id
    const media = await Media.findOrFail(id)
    const payload = await this.validateRequest(request)

    media.merge({
      type: payload.type,
      name: payload.name,
    })
    await media.save()

    if (payload.image) {
      await media.load('image')
      if (media.image) {
        await media.image.delete()
      }

      await media
        .related('image')
        .create({ file: await ResponsiveAttachment.fromFile(payload.image) })
    }

    if (payload.video) {
      await media.load('video')
      if (media.video) {
        await media.video.delete()
      }

      await media.related('video').create({ file: Attachment.fromFile(payload.video) })
    }

    return response.custom({
      message: 'Media Updated',
      code: 201,
      data: media,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract): Promise<void> {
    await bouncer.with('MediaPolicy').authorize('delete')
    const id = +params.id
    const media = await Media.findOrFail(id)
    if (media.type === MediaTypes.IMAGE) {
      await media.load('image')
      if (media.image) {
        await media.image.delete()
      }
    }

    if (media.type === MediaTypes.VIDEO) {
      await media.load('video')
      if (media.video) {
        await media.video.delete()
      }
    }

    await media.delete()

    return response.custom({
      message: 'Media Deleted',
      code: 200,
      data: media,
      success: true,
    })
  }

  private async validateRequest(request: HttpContextContract['request']) {
    const validationSchem = schema.create({
      name: schema.string({ trim: true }),
      type: schema.enum(Object.values(MediaTypes)),
      image: schema.file.optional({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '3mb',
      }),
      video: schema.file.optional({
        extnames: ['mp4'],
        size: '25mb',
      }),
    })

    const payload = await request.validate({
      schema: validationSchem,
    })

    return payload
  }
}
