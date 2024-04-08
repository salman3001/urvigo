import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SubcategoryCreateValidator {
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
    image: schema.file.optional({
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
      size: '5mb',
    }),
    category: schema.object().members({
      id: schema.number.optional(),
      name: schema.string({ trim: true }, [
        rules.maxLength(255),
        rules.unique({
          table: 'service_subcategories',
          column: 'name',
        }),
      ]),
      shortDesc: schema.string.optional([rules.maxLength(1024)]),
      longDesc: schema.string.optional(),
      status: schema.boolean.optional(),
    }),
    seo: schema.object.optional().members({
      metaTitle: schema.string.optional([rules.maxLength(255)]),
      metaKeywords: schema.string.optional([rules.maxLength(255)]),
      metaDesc: schema.string.optional([rules.maxLength(512)]),
    }),
    faq: schema.array.optional().members(
      schema.object().members({
        quest: schema.string([rules.maxLength(512)]),
        ans: schema.string([rules.maxLength(1500)]),
      })
    ),
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
