import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CouponType, DiscountType } from 'App/Helpers/enums'

export default class CouponCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({ escape: true }, [rules.maxLength(50)]),
    desc: schema.string({ escape: true }, [rules.maxLength(256)]),
    isActive: schema.boolean.optional(),
    discountType: schema.enum(Object.values(DiscountType)),
    discountFlat: schema.number.optional([rules.minNumber(0)]),
    discountPercentage: schema.number.optional([rules.maxNumber(99), rules.minNumber(0)]),
    maxUsers: schema.number(),
    minPurchaseAmount: schema.number([rules.minNumber(0)]),
    // serviceIds: schema.array().members(schema.number()),
    validFrom: schema.date({ format: 'dd/MM/yyyy HH:mm' }, [rules.after(1, 'minute')]),
    expiredAt: schema.date({ format: 'dd/MM/yyyy HH:mm' }, [rules.afterField('validFrom')]),
    serviceIds: schema.array.optional().members(schema.number()),
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
