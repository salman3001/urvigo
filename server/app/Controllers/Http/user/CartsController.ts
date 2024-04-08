import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Cart from 'App/Models/user/Cart'
import BaseController from '../BaseController'
import UpdateCartValidator from 'App/Validators/cart/UpdateCartValidator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class CartsController extends BaseController {
  constructor() {
    super(Cart, UpdateCartValidator, UpdateCartValidator, 'CartPolicy')
  }

  public async show(ctx: HttpContextContract) {
    await ctx.bouncer.with('CartPolicy').authorize('view')
    const user = ctx.auth.user

    // const isCustomer = user instanceof User

    // if (!user || !isCustomer) {
    //   return ctx.response.custom({
    //     code: 400,
    //     data: null,
    //     message: 'Bad Request! cart is only available for customer user',
    //     success: false,
    //   })
    // }

    const cartQuery = Cart.query().where('user_id', user!.id)
    this.showfilterQuery(ctx.request.qs() as any, cartQuery)

    const cart = await cartQuery.first()
    return ctx.response.custom({
      code: 200,
      data: cart,
      message: null,
      success: true,
    })
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('CartPolicy').authorize('update')

    let cart: Cart | null = null
    const user = auth.user

    await Database.transaction(async (trx) => {
      cart = await Cart.findByOrFail('user_id', user!.id, { client: trx })

      const payload = await request.validate(UpdateCartValidator)

      await cart.load('items')

      if (cart.items) {
        await cart.related('items').updateOrCreateMany(payload.items, 'serviceVariantId')
      }
    })

    await cart!.load('items')

    return response.custom({
      message: 'Cart Updated',
      code: 201,
      data: cart,
      success: true,
    })
  }

  public async deleteItem({ response, bouncer, auth, params }: HttpContextContract) {
    await bouncer.with('CartPolicy').authorize('delete')

    const itemId = params.itemId

    let cart: Cart | null = null
    const user = auth.user

    await Database.transaction(async (trx) => {
      cart = await Cart.findByOrFail('user_id', user!.id, { client: trx })
      await cart.load('items')
      for (const item of cart.items) {
        if (item.id == itemId) {
          await item.delete()
        }
      }
    })

    await cart!.load('items')

    return response.custom({
      message: 'Cart item deleted',
      code: 201,
      data: cart,
      success: true,
    })
  }

  public async clear({ response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('CartPolicy').authorize('delete')

    let cart: Cart | null = null
    const user = auth.user

    await Database.transaction(async (trx) => {
      cart = await Cart.findByOrFail('user_id', user!.id, { client: trx })
      await cart.load('items')
      for (const item of cart.items) {
        await item.delete()
      }
    })

    await cart!.load('items')

    return response.custom({
      message: 'Cart cleared',
      code: 200,
      data: cart,
      success: true,
    })
  }
}
