import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.maxLength(255),
      rules.email(),
      rules.unique({ table: 'admin_users', column: 'email' }),
      rules.normalizeEmail({ allLowercase: true }),
    ]),
    firstName: schema.string({ trim: true }, [rules.maxLength(50)]),
    lastName: schema.string({ trim: true }, [rules.maxLength(50)]),
    phone: schema.string.optional({ trim: true }, [rules.minLength(8)]),
    password: schema.string({ trim: true }, [
      rules.minLength(8),
      rules.maxLength(50),
      rules.alphaNum(),
    ]),
    isActive: schema.boolean.optional(),
    roleId: schema.number.optional(),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {}
}
