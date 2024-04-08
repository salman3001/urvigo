import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserProfileUpdateValidator {
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
    image: schema.file.optional({
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],

      size: '5mb',
    }),
    address: schema.array.optional().members(
      schema.object().members({
        address: schema.string({ trim: true }),
        geoLocation: schema.string(),
      })
    ),
    social: schema.object.optional().members({
      website: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      facebook: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      twitter: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      instagram: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      pintrest: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      linkedin: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      vk: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      whatsapp: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      telegram: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    }),
    languages: schema.array.optional().members(schema.number()),
    skills: schema.array.optional().members(
      schema.object().members({
        name: schema.string({ trim: true }, [rules.maxLength(50)]),
        desc: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      })
    ),
    NotificationSettings: schema.object.optional().members({
      onMessageRecieve: schema.boolean.optional(),
      onCommentReply: schema.boolean.optional(),
      onServiceUpdate: schema.boolean.optional(),
      onOffers: schema.boolean.optional(),
    }),
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
