import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Interest from 'App/Models/email/Interest'
import BaseApiController from '../BaseApiController'

export default class InterestController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('IntrestPolicy').authorize('viewList')
    const interestQuery = Interest.query()

    this.applyFilters(interestQuery, request.qs(), { searchFields: ['name'] })

    this.extraFilters(interestQuery, request)

    const interests = await this.paginate(request, interestQuery)

    return response.custom({
      code: 200,
      data: interests,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('IntrestPolicy').authorize('view')
    const id = params.id
    const interest = await Interest.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: interest,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('IntrestPolicy').authorize('create')

    const payload = await request.validate({} as any)
    const record = await Interest.create(payload)
    return response.custom({
      message: 'Interest Created',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('IntrestPolicy').authorize('update')
    const interest = await Interest.findOrFail(+params.id)
    const payload = await request.validate({} as any)
    interest.merge(payload)
    await interest.save()
    return response.custom({
      message: 'Interest Updated',
      code: 201,
      data: interest,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const interest = await Interest.findOrFail(+params.id)

    await bouncer.with('IntrestPolicy').authorize('delete')

    await interest.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: interest,
    })
  }
}
