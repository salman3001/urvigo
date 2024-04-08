import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Subscriber from 'App/Models/email/Subscriber'
import CreateSubscriberValidator from 'App/Validators/news-letter/CreateSubscriberValidator'
import { validator } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import UpdateSubscriberValidator from 'App/Validators/news-letter/UpdateSubscriberValidator'
import BaseApiController from '../BaseApiController'

export default class SubscribersController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('SubscriberPolicy').authorize('viewList')
    const subscriberQeury = Subscriber.query()

    this.applyFilters(subscriberQeury, request.qs(), { searchFields: ['name'] })

    this.extraFilters(subscriberQeury, request)

    const subscribers = await this.paginate(request, subscriberQeury)

    return response.custom({
      code: 200,
      data: subscribers,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('SubscriberPolicy').authorize('view')
    const id = params.id
    const subscriber = await Subscriber.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: subscriber,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('SubscriberPolicy').authorize('create')

    const payload = await request.validate(CreateSubscriberValidator)
    const subscriber = await Subscriber.create(payload.subscriber)

    if (payload.interests) {
      await subscriber.related('interests').attach(payload.interests)
    }

    return response.custom({
      message: 'Subscriber Created',
      code: 201,
      data: subscriber,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('SubscriberPolicy').authorize('update')

    const subscriber = await Subscriber.findOrFail(+params.id)
    const payload = await request.validate(UpdateSubscriberValidator)

    subscriber.merge(payload.subscriber)
    await subscriber.save()

    if (payload.interests) {
      await subscriber.related('interests').detach()
      await subscriber.related('interests').attach(payload.interests)
    }

    return response.custom({
      message: 'Subscriber Updated',
      code: 201,
      data: subscriber,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const subscriber = await Subscriber.findOrFail(+params.id)

    await bouncer.with('SubscriberPolicy').authorize('delete')

    await subscriber.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: subscriber,
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, ...rest } = record
    const dob = DateTime.fromISO(rest.dob).toFormat('dd/MM/yyyy') //=> '2014 Aug 06'
    return { ...rest, dob }
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    const validatedData = await validator.validate({
      schema: new CreateSubscriberValidator(ctx).schema,
      data: {
        subscriber: data,
      },
    })

    await Subscriber.updateOrCreate({ id: validatedData.subscriber!.id }, validatedData.subscriber!)
  }
}
