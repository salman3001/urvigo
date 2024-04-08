import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminUserUpdateValidator {
  public id: number | null = null
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    email: schema.string({ trim: true }, [
      rules.maxLength(255),
      rules.unique({
        table: 'admin_users',
        column: 'email',
        whereNot: { id: this.ctx.params?.id || this.ctx?.meta?.currentObjectId },
      }),
      rules.email(),
      rules.normalizeEmail({ allLowercase: true }),
    ]),
    password: schema.string.optional({ trim: true }, [
      rules.minLength(8),
      rules.maxLength(50),
      rules.alphaNum(),
    ]),
    firstName: schema.string({ trim: true }, [rules.maxLength(50)]),
    lastName: schema.string({ trim: true }, [rules.maxLength(50)]),
    phone: schema.string.optional({ trim: true }, [rules.minLength(8), rules.maxLength(15)]),
    isActive: schema.boolean.optional(),
    roleId: schema.number.optional(),
  })
}
