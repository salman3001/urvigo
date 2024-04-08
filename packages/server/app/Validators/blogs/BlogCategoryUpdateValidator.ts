import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BlogCategoryUpdateValidator {
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
    id: schema.number.optional(),
    name: schema.string({ trim: true }, [
      rules.maxLength(255),
      rules.unique({
        table: 'blog_categories',
        column: 'name',
        whereNot: {
          id: this.ctx.params?.id || this.ctx?.meta?.currentObjectId,
        },
      }),
    ]),
    slug: schema.string.optional({ trim: true }, [
      rules.maxLength(300),
      rules.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      rules.unique({
        table: 'blog_categories',
        column: 'slug',
      }),
    ]),
    order: schema.number.optional(),
    status: schema.boolean.optional(),
    languageId: schema.number.optional(),
    metaTitle: schema.string.optional([rules.maxLength(255)]),
    metaKeywords: schema.string.optional([rules.maxLength(255)]),
    metaDesc: schema.string.optional([rules.maxLength(500)]),
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
