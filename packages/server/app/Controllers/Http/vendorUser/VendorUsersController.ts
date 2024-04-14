import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import VendorUserUpdateValidator from 'App/Validators/vendorUser/VendorUserUpdateValidator'
import VendorUserCreateValidator from 'App/Validators/vendorUser/VendorUserCreateValidator'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Database from '@ioc:Adonis/Lucid/Database'
import VendorProfileUpdateValidator from 'App/Validators/VendorProfileUpdateValidator'
import Image from 'App/Models/Image'
import VendorProfile from 'App/Models/vendorUser/VendorProfile'
import Review from 'App/Models/Review'
import CreateReviewValidator from 'App/Validators/CreateReviewValidator'
import BaseApiController from '../BaseApiController'

export default class VendorUsersController extends BaseApiController {
  public async index({ response, request, bouncer }: HttpContextContract) {
    await bouncer.with('VendorUserPolicy').authorize('viewList')
    const vendorQuery = VendorUser.query()

    this.applyFilters(vendorQuery, request.qs, { searchFields: ['first_name', 'last_name'] })

    const reviews = await this.paginate(request, vendorQuery)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: reviews,
    })
  }

  public async show({ response, params, bouncer }: HttpContextContract) {
    const vendor = await VendorUser.query()
      .where('id', +params.id)
      .preload('reviews', (r) => {
        r.limit(10).orderBy('created_at')
      })
      .preload('profile')
      .withCount('reviews')
      .firstOrFail()
    await bouncer.with('VendorUserPolicy').authorize('view', vendor)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: vendor,
    })
  }

  public async getReviews({ response, params, request }: HttpContextContract) {
    const reviewsQuery = Review.query().where('vendor_user_id', params.id)

    const reviews = await this.paginate(request, reviewsQuery)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: reviews,
    })
  }

  public async create_review({ request, response, bouncer, auth, params }: HttpContextContract) {
    await bouncer.with('ReviewPolicy').authorize('create')

    const user = auth.user
    const vendorId = params.id

    const reviewExist = await Review.query()
      .where('user_id', user!.id)
      .where('vendor_user_id', vendorId)
      .first()

    if (reviewExist) {
      return response.custom({
        code: 400,
        message: 'You have already rated this vendor',
        success: false,
        data: null,
      })
    }

    const payload = await request.validate(CreateReviewValidator)

    const review = await Review.create({ ...payload, userId: user?.id, vendorUserId: vendorId })
    return response.custom({
      message: 'Review added',
      code: 201,
      data: review,
      success: true,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    const { userType, ...payload } = await request.validate(VendorUserCreateValidator)

    await bouncer.with('VendorUserPolicy').authorize('create')

    let user: VendorUser | null = null

    await Database.transaction(async (trx) => {
      user = await VendorUser.create(payload, { client: trx })
    })

    return response.custom({
      message: 'User Added Successfully',
      code: 201,
      data: user,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    const payload = await request.validate(VendorUserUpdateValidator)
    const id = params.id
    const user = await VendorUser.findOrFail(id)
    await bouncer.with('VendorUserPolicy').authorize('update', user)

    user.merge(payload)
    await user.save()

    return response.custom({
      message: 'User updated Successfully',
      code: 201,
      data: user,
      success: true,
    })
  }

  public async updateProfile({ request, response, params, bouncer }: HttpContextContract) {
    const user = await VendorUser.findOrFail(+params.id)

    const { address, avatar, images, logo, seo, profile, ...payload } = await request.validate(
      VendorProfileUpdateValidator
    )

    const vendorProfile = await VendorProfile.findByOrFail('vendor_user_id', user.id)

    if (!vendorProfile) {
      return response.custom({
        code: 404,
        message: 'User profile not found',
        data: null,
        success: false,
      })
    }

    await bouncer.with('BussinessPolicy').authorize('update', vendorProfile)

    await Database.transaction(async (trx) => {
      vendorProfile.useTransaction(trx)
      user.useTransaction(trx)
      user.merge(payload)
      await user.save()

      if (profile) {
        vendorProfile.merge(profile)
        await vendorProfile.save()
      }

      if (address) {
        await vendorProfile.load('addresses')

        if (vendorProfile.addresses) {
          for (const address of vendorProfile.addresses) {
            await address.delete()
          }
          await vendorProfile.related('addresses').createMany(address)
        } else {
          await vendorProfile.related('addresses').createMany(address)
        }
      }

      if (payload.social) {
        await vendorProfile?.load('social')
        if (vendorProfile?.social) {
          await vendorProfile.social.delete()
          await vendorProfile.related('social').create(payload.social)
        } else {
          await vendorProfile.related('social').create(payload.social)
        }
      }

      if (avatar) {
        vendorProfile.avatar = await ResponsiveAttachment.fromFile(avatar)
      }

      if (logo) {
        vendorProfile.logo = await ResponsiveAttachment.fromFile(logo)
      }

      if (images) {
        await vendorProfile.load('images')

        await Promise.all(
          vendorProfile.images.map(async (s) => {
            await s.delete()
          })
        )

        const createdImages = await Promise.all(
          images.map(async (img) => {
            try {
              const storeImg = await Image.create({
                file: await ResponsiveAttachment.fromFile(img),
              })
              return storeImg
            } catch (error) {
              console.error('Error storing image:', error)
              // Handle the error or decide whether to skip this image
              return null
            }
          })
        )

        // Filter out any null values (images that failed to store)
        const validImages = createdImages.filter((img) => img !== null)
        await vendorProfile.related('images').saveMany(validImages as Image[])
      }

      await vendorProfile.save()
    })

    return response.custom({
      message: 'Business profile Updated!',
      code: 201,
      data: vendorProfile,
      success: true,
    })
  }

  public async banUser({ params, response, bouncer }: HttpContextContract) {
    await bouncer.with('VendorUserPolicy').authorize('delete')
    const user = await VendorUser.findOrFail(+params.id)
    user.isActive = false
    await user.save()
    return response.custom({
      message: 'User Banned Successfully',
      code: 200,
      data: user,
      success: true,
    })
  }

  public async updateUserPassword({ params, response, request, bouncer }: HttpContextContract) {
    const user = await VendorUser.findOrFail(+params.id)

    await bouncer.with('VendorUserPolicy').authorize('update', user)

    const validationSchema = schema.create({
      password: schema.string({ trim: true }, [rules.minLength(8)]),
      password_confirmation: schema.string({ trim: true }, [rules.confirmed('password')]),
    })

    const payload = await request.validate({
      schema: validationSchema,
    })
    user.password = payload.password
    await user.save()
    return response.custom({
      message: 'Password changed',
      code: 200,
      data: user,
      success: true,
    })
  }

  public async updateSubscribedCategories({
    response,
    request,
    bouncer,
    auth,
  }: HttpContextContract) {
    const user = auth.user

    const isVendorUser = user instanceof VendorUser
    if (!isVendorUser) {
      return response.custom({
        code: 401,
        data: null,
        message: 'Not Authorized',
        success: false,
      })
    }

    await bouncer.with('VendorUserPolicy').authorize('update', user)

    const validationSchema = schema.create({
      serviceCategoryIds: schema.array().members(schema.number()),
    })

    const payload = await request.validate({
      schema: validationSchema,
    })
    await user.related('subscribedCategories').detach()
    await user.related('subscribedCategories').attach(payload.serviceCategoryIds)

    return response.custom({
      message: 'Subscribed categories updated',
      code: 200,
      data: user,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const vendor = await VendorUser.findOrFail(+params.id)

    await bouncer.with('VendorUserPolicy').authorize('delete')

    await vendor.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: vendor,
    })
  }
}
