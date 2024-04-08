import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DiscountType } from 'App/Helpers/enums'

export default class ServiceCreateValidator {
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
    video: schema.file.optional({
      extnames: ['mp4'],
      size: '25mb',
    }),
    images: schema.array.optional().members(
      schema.file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
      })
    ),
    variantImages: schema.array.optional().members(
      schema.file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
      })
    ),
    thumbnail: schema.file.optional({
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
      size: '5mb',
    }),
    service: schema.object().members({
      name: schema.string({ trim: true }, [
        rules.maxLength(255),
        rules.unique({
          table: 'services',
          column: 'name',
        }),
      ]),
      shortDesc: schema.string.optional([rules.maxLength(1024)]),
      longDesc: schema.string.optional(),
      isActive: schema.boolean.optional(),
      locationSpecific: schema.boolean.optional(),
      geoLocation: schema.string(),
      serviceCategoryId: schema.number.optional(),
      serviceSubcategoryId: schema.number.optional(),
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
    tags: schema.array.optional().members(schema.number()),
    variant: schema.array().members(
      schema.object().members({
        name: schema.string([rules.maxLength(100)]),
        price: schema.number(),
        discountType: schema.enum(Object.values(DiscountType)),
        discountFlat: schema.number.optional([
          rules.numberLessThanField('price'),
          rules.minNumber(0),
        ]),
        discountPercentage: schema.number.optional([rules.maxNumber(99), rules.minNumber(0)]),
        desc: schema.string.optional([rules.maxLength(512)]),
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
