import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { userTypes } from 'App/Helpers/enums'

export default class VendorUserCreateValidator {
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
    firstName: schema.string({ trim: true }, [rules.maxLength(50)]),
    lastName: schema.string({ trim: true }, [rules.maxLength(50)]),
    userType: schema.enum(Object.values(userTypes)),
    businessName: schema.string({ escape: true }, [
      rules.maxLength(100),
      rules.unique({
        table: 'businesses',
        column: 'name',
      }),
    ]),

    email: schema.string({ trim: true }, [
      rules.maxLength(255),
      rules.email(),
      rules.normalizeEmail({ allLowercase: true }),
      rules.unique({ table: 'vendor_users', column: 'email' }),
    ]),
    password: schema.string({ trim: true }, [rules.maxLength(50)]),
    passwordConfirmation: schema.string({ trim: true }, [rules.confirmed('password')]),
    phone: schema.string.optional([rules.maxLength(15)]),
    isActive: schema.boolean.optional(),
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
  public messages: CustomMessages = {}
}
