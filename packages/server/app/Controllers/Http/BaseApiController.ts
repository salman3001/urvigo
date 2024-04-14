import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Config from '@ioc:Adonis/Core/Config'

export default class BaseApiController {
  public async paginate(
    request: HttpContextContract['request'],
    modelQuery: ModelQueryBuilderContract<any, any>
  ) {
    const model = await modelQuery.paginate(
      request.qs().page || 1,
      request.qs().perPage || Config.get('common.rowsPerPage')
    )
    return model
  }

  public applyFilters(
    modelQuery: ModelQueryBuilderContract<any, any>,
    qs: Record<string, any>,
    opt?: {
      searchFields?: string[]
    }
  ) {
    for (const key in qs) {
      if (Object.prototype.hasOwnProperty.call(qs, key)) {
        const value = qs[key]

        if (value) {
          const newVal = `%${qs[key]}%`
          if (key === 'search') {
            opt?.searchFields?.forEach((field, i) => {
              if (i == 0) {
                modelQuery.whereILike(field, newVal)
              } else {
                modelQuery.orWhereILike(field, newVal)
              }
            })
          }

          if (key === 'orderBy') {
            const [orderBy, direction] = value.split(':')
            modelQuery.orderBy(orderBy, (direction as 'desc') || 'asc')
          }

          if (key.startsWith('field__')) {
            const field = key.split('__')[1]
            modelQuery.where(field, value)
          }
        }
      }
    }

    return modelQuery
  }

  public extraFilters(
    modelQuery: ModelQueryBuilderContract<any, any>,
    request: HttpContextContract['request'],
    opt?: Record<any, any>
  ) {}
}
