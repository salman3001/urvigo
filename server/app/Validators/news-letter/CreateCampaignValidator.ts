import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateCampaignValidator {
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
    campaign: schema.object().members({
      id: schema.number.optional(),
      name: schema.string([rules.maxLength(255)]),
      subject: schema.string([rules.maxLength(255)]),
      fromName: schema.string([rules.maxLength(255)]),
      fromEmail: schema.string({ trim: true }, [
        rules.maxLength(255),
        rules.email(),
        rules.normalizeEmail({ allLowercase: true }),
      ]),
      replyTo: schema.string({ trim: true }, [
        rules.maxLength(255),
        rules.email(),
        rules.normalizeEmail({ allLowercase: true }),
      ]),
      status: schema.boolean(),
      deliveryDateTime: schema.date({
        format: 'dd/MM/yyyy HH:mm',
      }),
      campaignTypeId: schema.number.optional(),
    }),
    interests: schema.array.optional().members(schema.number()),
    templateId: schema.number.optional(),
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
