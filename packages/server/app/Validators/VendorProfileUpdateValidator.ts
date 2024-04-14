import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VendorProfileUpdateValidator {
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
    avatar: schema.file.optional({
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
      size: '5mb',
    }),
    logo: schema.file.optional({
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
      size: '5mb',
    }),
    images: schema.array.optional().members(
      schema.file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
      })
    ),
    firstName: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
    lastName: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
    businessName: schema.string.optional([rules.maxLength(100)]),
    email: schema.string.optional({ trim: true }, [
      rules.maxLength(255),
      rules.email(),
      rules.normalizeEmail({ allLowercase: true }),
      rules.unique({ table: 'users', column: 'email', whereNot: { id: this.ctx.params.id } }),
    ]),
    password: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
    phone: schema.string.optional([rules.maxLength(15)]),
    isActive: schema.boolean.optional(),
    profile: schema.object.optional().members({
      shortDesc: schema.string.optional([rules.maxLength(500)]),
      longDesc: schema.string.optional(),
      isActive: schema.boolean.optional(),
    }),
    seo: schema.object.optional().members({
      metaTitle: schema.string.optional([rules.maxLength(255)]),
      metaKeywords: schema.string.optional([rules.maxLength(255)]),
      metaDesc: schema.string.optional([rules.maxLength(1000)]),
    }),
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

    faq: schema.array.optional().members(
      schema.object().members({
        quest: schema.string([rules.maxLength(500)]),
        ans: schema.string([rules.maxLength(1500)]),
      })
    ),
    address: schema.array.optional().members(
      schema.object().members({
        address: schema.string({ trim: true }, [rules.maxLength(500)]),
        geoLocation: schema.string([rules.maxLength(20)]),
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
