import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import WishlistUpdateValidator from 'App/Validators/WishlistUpdateValidator'
import Wishlist from 'App/Models/user/Wishlist'
import BaseApiController from '../BaseApiController'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class WishlistsController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('WishlistPolicy').authorize('viewList')
    const wishlistQuery = Wishlist.query()

    this.applyFilters(wishlistQuery, request.qs(), { searchFields: ['slug'] })

    this.extraFilters(wishlistQuery, request)

    const wishlist = await wishlistQuery.exec()

    return response.custom({
      code: 200,
      data: wishlist,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('WishlistPolicy').authorize('view')

    const wishlist = await Wishlist.query()
      .where('user_id', auth.user?.id!)
      .preload('items', (i) => {
        i.select('id')
      })
      .firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: wishlist,
    })
  }

  public async showDetailList({ response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('WishlistPolicy').authorize('view')

    const wishlist = await Wishlist.query()
      .where('user_id', auth.user?.id!)
      .preload('items', (i) => {
        i.preload('serviceCategory', (s) => {
          s.select(['name'])
        })
          .preload('serviceSubcategory', (s) => {
            s.select(['id', 'name'])
          })
          .preload('tags', (s) => {
            s.select(['id', 'name'])
          })
          .preload('images')
          .preload('variants')
          .select([
            'id',
            'name',
            'slug',
            'short_desc',
            'is_active',
            'geo_location',
            'thumbnail',
            'avg_rating',
            'vendor_user_id',
            'service_category_id',
            'service_subcategory_id',
            'created_at',
          ])
          .withCount('reviews', (r) => {
            r.as('reviews_count')
          })
          .withAggregate('variants', (v) => {
            v.min('price').as('starting_from')
          })
      })
      .firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: wishlist,
    })
  }

  public async add({ response, request, bouncer, auth }: HttpContextContract) {
    await bouncer.with('WishlistPolicy').authorize('update')

    const wishlist = await Wishlist.query().where('user_id', auth.user?.id!).firstOrFail()

    const vallidationSchema = schema.create({
      serviceId: schema.number(),
    })

    const payload = await request.validate({
      schema: vallidationSchema,
    })

    await wishlist.related('items').attach([payload.serviceId])
    await wishlist.save()

    return response.custom({
      code: 200,
      success: true,
      message: 'Item Added to Wishlist',
      data: wishlist,
    })
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('WishlistPolicy').authorize('update')

    let wishlist: Wishlist | null = null
    const user = auth.user

    await Database.transaction(async (trx) => {
      wishlist = await Wishlist.findByOrFail('user_id', user!.id, { client: trx })

      const payload = await request.validate(WishlistUpdateValidator)

      await wishlist.load('items')

      if (wishlist.items) {
        await wishlist.related('items').detach(payload.serviceVariantIds)
      }

      await wishlist.related('items').attach(payload.serviceVariantIds)
    })

    await wishlist!.load('items')

    return response.custom({
      message: 'Wishlist Updated',
      code: 201,
      data: wishlist,
      success: true,
    })
  }

  public async deleteItem({ response, bouncer, auth, params }: HttpContextContract) {
    await bouncer.with('WishlistPolicy').authorize('delete')

    const itemId = params.itemId

    let wishlist: Wishlist | null = null
    const user = auth.user

    await Database.transaction(async (trx) => {
      wishlist = await Wishlist.findByOrFail('user_id', user!.id, { client: trx })
      await wishlist.related('items').detach([itemId])
    })

    await wishlist!.load('items')

    return response.custom({
      message: 'Item Removed from Wishlist',
      code: 201,
      data: wishlist,
      success: true,
    })
  }

  public async clear({ response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('WishlistPolicy').authorize('delete')

    let wishlist: Wishlist | null = null
    const user = auth.user

    await Database.transaction(async (trx) => {
      wishlist = await Wishlist.findByOrFail('user_id', user!.id, { client: trx })
      await wishlist.related('items').detach()
    })

    await wishlist!.load('items')

    return response.custom({
      message: 'Wishlist cleared',
      code: 200,
      data: wishlist,
      success: true,
    })
  }
}
