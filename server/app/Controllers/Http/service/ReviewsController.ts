// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Review from 'App/Models/Review'
import CreateReviewValidator from 'App/Validators/CreateReviewValidator'
import UpdateReviewValidator from 'App/Validators/UpdateReviewValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseApiController from '../BaseApiController'

export default class ReviewsController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ReviewPolicy').authorize('viewList')
    const reviewQuery = Review.query()

    this.applyFilters(reviewQuery, request.qs(), { searchFields: ['slug'] })

    this.extraFilters(reviewQuery, request)

    const reviews = await this.paginate(request, reviewQuery)

    return response.custom({
      code: 200,
      data: reviews,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('ReviewPolicy').authorize('view')
    const id = params.id
    const review = await Review.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: review,
    })
  }

  public async store({ request, response, bouncer, auth, params }: HttpContextContract) {
    await bouncer.with('ReviewPolicy').authorize('create')

    const user = auth.user
    const serviceId = params.serviceId

    const reviewExist = await Review.query()
      .where('user_id', user!.id)
      .where('service_id', serviceId)
      .first()

    if (reviewExist) {
      return response.custom({
        code: 400,
        message: 'You have already rated this service',
        success: false,
        data: null,
      })
    }

    const payload = await request.validate(CreateReviewValidator)

    const review = await Review.create({ ...payload, userId: user?.id, serviceId: serviceId })
    return response.custom({
      message: 'Review added',
      code: 201,
      data: review,
      success: true,
    })
  }

  public async update({ params, request, response, bouncer }: HttpContextContract) {
    const review = await Review.findOrFail(+params.id)

    await bouncer.with('ReviewPolicy').authorize('update')
    const payload = await request.validate(UpdateReviewValidator)

    review.merge(payload)

    await review.save()
    return response.custom({
      message: 'Review updated',
      code: 201,
      data: review,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const review = await Review.findOrFail(+params.id)

    await bouncer.with('ReviewPolicy').authorize('delete', review)

    await review.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: review,
    })
  }
}
