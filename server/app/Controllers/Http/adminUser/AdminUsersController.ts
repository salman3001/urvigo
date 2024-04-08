import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdminUser from 'App/Models/adminUser/AdminUser'
import AdminUserValidator from 'App/Validators/adminUser/AdminUserValidator'
import AdminUserUpdateValidator from 'App/Validators/adminUser/AdminUserUpdateValidator'
import Role from 'App/Models/adminUser/Role'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { LucidRow } from '@ioc:Adonis/Lucid/Orm'
import UserProfileUpdateValidator from 'App/Validators/UserProfileUpdateValidator'
import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import UserProfile from 'App/Models/UserProfile'
import BaseApiController from '../BaseApiController'

export default class AdminUsersController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('AdminUserPolicy').authorize('viewList')
    const adminUserQuery = AdminUser.query()
      .preload('role', (r) => {
        r.select(['name', 'id'])
      })
      .preload('profile', (p) => {
        p.select(['avatar', 'id'])
      })

    this.applyFilters(adminUserQuery, request.qs(), { searchFields: ['first_name', 'last_name'] })

    this.extraFilters(adminUserQuery, request)

    const adminUsers = await this.paginate(request, adminUserQuery)

    return response.custom({
      code: 200,
      data: adminUsers,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    const id = params.id
    const adminUser = await AdminUser.query()
      .where('id', id)
      .preload('role')
      .preload('profile')
      .preload('activities')
      .firstOrFail()

    await bouncer.with('AdminUserPolicy').authorize('view', adminUser)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: adminUser,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('AdminUserPolicy').authorize('create')
    const payload = await request.validate(AdminUserValidator)
    const user = await AdminUser.create(payload)

    await user.save()

    return response.custom({
      message: 'User Created!',
      code: 201,
      data: user,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    let user = await AdminUser.findOrFail(+params.id)
    await bouncer.with('AdminUserPolicy').authorize('update', user as AdminUser)
    const payload = await request.validate(AdminUserUpdateValidator)
    user.merge(payload)
    await user.save()

    if (payload.roleId) {
      user.roleId = +payload.roleId
    }

    await user?.save()

    return response.custom({
      message: 'User Updated!',
      code: 201,
      data: user,
      success: true,
    })
  }

  public async updateProfile({ request, response, params, bouncer }: HttpContextContract) {
    const user = await AdminUser.findOrFail(+params.id)
    await bouncer.with('AdminUserPolicy').authorize('update', user as unknown as AdminUser)
    user.load('profile')
    const profile = await UserProfile.findByOrFail('admin_user_id', user.id)

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

    if (payload.favoriteLinks) {
      await profile?.load('favoriteLinks')

      if (profile?.favoriteLinks) {
        profile.favoriteLinks.forEach((l) => {
          l.delete()
        })
      }

      await profile.related('favoriteLinks').createMany(payload.favoriteLinks)
    }

    if (payload.workExperience) {
      await profile?.load('experiences')

      if (profile?.experiences) {
        if (profile?.experiences) {
          for (const e of profile.experiences) {
            await e.delete()
          }
        }
      }
      await profile.related('experiences').createMany(payload.workExperience)
    }

    if (payload.education) {
      await profile?.load('educations')

      if (profile?.educations) {
        if (profile?.educations) {
          for (const e of profile.educations) {
            await e.delete()
          }
        }
      }
      await profile.related('educations').createMany(payload.education)
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

    await user.save()

    return response.custom({
      message: 'User Profile Updated!',
      code: 201,
      data: profile,
      success: true,
    })
  }

  public async banUser({ params, response, bouncer }: HttpContextContract) {
    const user = await AdminUser.findOrFail(+params.id)
    await bouncer.with('AdminUserPolicy').authorize('delete')
    if (user) {
      user.isActive = false
      await user.save()
      return response.custom({
        message: 'User banned!',
        code: 200,
        data: user,
        success: true,
      })
    } else {
      return response.custom({
        message: 'User Not found!',
        code: 400,
        data: user,
        success: false,
      })
    }
  }

  public async changeRole({ params, response, request, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('update')
    const roleId = request.input('roleId')
    const role = await Role.find(+roleId)

    const user = await AdminUser.find(+params.id)
    await user?.related('role').dissociate()
    if (role) await user?.related('role').associate(role)

    return response.custom({
      message: 'Role Updated!',
      code: 201,
      data: null,
      success: true,
    })
  }

  public async updateUserPassword({ params, response, request, bouncer }: HttpContextContract) {
    const user = await AdminUser.findOrFail(+params.id)

    await bouncer.with('AdminUserPolicy').authorize('updatePassword', user)

    const validationSchema = schema.create({
      password: schema.string({ trim: true }, [rules.minLength(8)]),
      password_confirmation: schema.string({ trim: true }, [rules.confirmed('password')]),
    })

    const payload = await request.validate({
      schema: validationSchema,
    })
    // const newPassword = await Hash.make(payload.password)
    user.password = payload.password
    await user.save()
    return response.custom({
      message: 'Password changed',
      code: 201,
      data: null,
      success: true,
    })
  }

  public async getExportRecords(): Promise<LucidRow[]> {
    const records = await AdminUser.query()
      .select('id', 'first_name', 'last_name', 'email', 'password', 'phone', 'is_active', 'role_id')
      .exec()

    return records
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const user = await AdminUser.findOrFail(+params.id)

    await bouncer.with('AdminUserPolicy').authorize('delete')

    await user.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: user,
    })
  }

  // public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
  //   const { address, social, ...rest } = data

  //   ctx.meta = {
  //     currentObjectId: data.id,
  //   }

  //   const validatedData = await validator.validate({
  //     schema: new AdminUserUpdateValidator(ctx).schema,
  //     data: {
  //       user: rest,
  //       address,
  //       social,
  //     },
  //   })

  //   const user = await AdminUser.updateOrCreate(
  //     { email: validatedData.user.email },
  //     validatedData.user
  //   )
  // }

  public excludeIncludeExportProperties(record: any) {
    return { ...record, password: '' }
  }
}
