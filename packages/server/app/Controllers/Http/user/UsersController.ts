import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserCreateValidator from 'App/Validators/user/UserCreateValidator'
import UserUpdateeValidator from 'App/Validators/user/UserUpdateValidator'
import User from 'App/Models/user/User'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import UserProfileUpdateValidator from 'App/Validators/UserProfileUpdateValidator'
import UserProfile from 'App/Models/UserProfile'
import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import BaseApiController from '../BaseApiController'

export default class UsersController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('userPolicy').authorize('viewList')
    const userQuery = User.query().preload('profile', (p) => {
      p.select(['avatar'])
    })

    this.applyFilters(userQuery, request.qs(), { searchFields: ['slug'] })

    this.extraFilters(userQuery, request)

    const users = await this.paginate(request, userQuery)

    return response.custom({
      code: 200,
      data: users,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    const id = params.id
    const user = await User.query()
      .where('id', id)
      .preload('profile')
      .preload('wishlist')
      .firstOrFail()
    await bouncer.with('userPolicy').authorize('view', user)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: user,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    const { userType, ...payload } = await request.validate(UserCreateValidator)
    const user = new User()
    await bouncer.with('userPolicy').authorize('create')

    user.merge(payload)
    await user.save()

    return response.custom({
      message: 'User Added Successfully',
      code: 201,
      data: user,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    const payload = await request.validate(UserUpdateeValidator)
    const id = params.id
    const user = await User.findOrFail(id)
    await bouncer.with('userPolicy').authorize('update', user)

    user.merge(payload)
    await user.save()

    await user.refresh()
    await user.load('profile')

    return response.custom({
      message: 'User updated Successfully',
      code: 201,
      data: user,
      success: true,
    })
  }

  public async updateProfile({ request, response, params, bouncer }: HttpContextContract) {
    const user = await User.findOrFail(+params.id)
    await bouncer.with('userPolicy').authorize('update', user)
    const profile = await UserProfile.findByOrFail('user_id', user.id)

    const payload = await request.validate(UserProfileUpdateValidator)
    if (payload.address) {
      await profile.load('addresses')

      if (profile.addresses) {
        for (const address of profile.addresses) {
          await address.delete()
        }
        await profile.related('addresses').createMany(payload.address)
      } else {
        await profile.related('addresses').createMany(payload.address)
      }
    }

    if (payload.social) {
      await profile?.load('social')
      if (profile?.social) {
        await profile.social.delete()
        await profile.related('social').create(payload.social)
      } else {
        await profile.related('social').create(payload.social)
      }
    }

    if (payload.image) {
      profile.avatar = await ResponsiveAttachment.fromFile(payload.image)
    }

    if (payload.languages) {
      await profile.load('languages')
      if (profile.languages) {
        profile.related('languages').detach()
        await profile.related('languages').attach(payload.languages)
      } else {
        await profile.related('languages').attach(payload.languages)
      }
    }

    if (payload.skills) {
      await profile?.load('skills')
      if (profile?.skills) {
        await profile.related('skills').detach()
        await profile.related('skills').createMany(payload.skills)
      } else {
        await profile.related('skills').createMany(payload.skills)
      }
    }

    if (payload.NotificationSettings) {
      profile.notificationSetting = payload.NotificationSettings
    }

    await profile.save()

    return response.custom({
      message: 'User Profile Updated!',
      code: 201,
      data: profile,
      success: true,
    })
  }

  public async banUser({ params, response, bouncer }: HttpContextContract) {
    await bouncer.with('userPolicy').authorize('delete')
    const user = await User.findOrFail(+params.id)
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
    const user = await User.findOrFail(+params.id)

    await bouncer.with('userPolicy').authorize('update', user)

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

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const user = await User.findOrFail(+params.id)

    await bouncer.with('userPolicy').authorize('delete')

    await user.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: user,
    })
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    ctx.meta = {
      currentObjectId: data.id,
    }
    const validatedData = await validator.validate({
      schema: new UserUpdateeValidator(ctx).schema,
      data: {
        user: data,
      },
    })

    await User.updateOrCreate({ id: validatedData.id }, validatedData)
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, avatar, ...rest } = record
    return { ...rest, password: '' }
  }
}
