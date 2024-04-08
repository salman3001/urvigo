import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Role from 'App/Models/adminUser/Role'
import { permissions } from 'App/Helpers/enums'
import BaseApiController from '../BaseApiController'

export default class RolesController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('viewList')
    const roleQuery = Role.query()

    this.applyFilters(roleQuery, request.qs(), { searchFields: ['name'] })

    this.extraFilters(roleQuery, request)

    const roles = await this.paginate(request, roleQuery)

    return response.custom({
      code: 200,
      data: roles,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('view')

    const id = params.id
    const role = await Role.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: role,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('create')

    const payloadSchema = schema.create({
      name: schema.string({ trim: true }, [
        rules.maxLength(50),
        rules.unique({
          table: 'roles',
          column: 'name',
        }),
      ]),
      isActive: schema.boolean.optional(),
    })

    const payload = await request.validate({ schema: payloadSchema })

    const record = await Role.create(payload)

    return response.custom({
      message: 'Role Created!',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('update')
    const role = await Role.findOrFail(+params.id)

    const permissions = request.input('permissions') || []

    const isActive = request.input('isActive')

    role.isActive = isActive
    role.permissions = permissions
    await role.save()

    return response.custom({
      message: 'Role Updated!',
      code: 201,
      data: role,
      success: true,
    })
  }

  public async allPermissions({ response, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('viewList')

    const permissionsArray: string[] = []

    for (const perm of Object.values(permissions)) {
      permissionsArray.push(perm)
    }

    return response.custom({
      message: null,
      code: 200,
      data: permissionsArray,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const role = await Role.findOrFail(+params.id)

    await bouncer.with('RolePolicy').authorize('delete')

    await role.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: role,
    })
  }
}
