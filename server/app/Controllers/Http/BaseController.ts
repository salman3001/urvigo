import {
  LucidModel,
  LucidRow,
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PoliciesList } from '@ioc:Adonis/Addons/Bouncer'
import { convertKeysToCamelCase } from 'App/Helpers/toCamelCase'
import * as XLSX from 'xlsx'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import { flatten, unflatten } from 'uni-flatten'
import { schema, validator } from '@ioc:Adonis/Core/Validator'
import * as qsModule from 'qs'

type preload = Record<
  string,
  {
    select?: select
    where?: where
    preload?: preload[]
    withAggregate: withAggregate[]
    withCount: withCount[]
    limit: number
    sortBy: string
    descending: 'true' | 'false' | null
  }
>
type whereLike = Record<string, string> | null
type whereILike = Record<string, string> | null
type opt = '>' | '>=' | '>' | '>=' | '='
type where = Record<string, [opt, string]>
type select = string[] | null
type Join = string[]
type withAggregate = {
  relation: string
  aggregator: string
  field: string
  as: string
}
type withCount = {
  relation: string
  as: string
}

export interface IndexQs {
  page: number | null
  rowsPerPage: string | null
  sortBy: string | null
  descending: 'true' | 'false' | null
  select: select
  whereLike: whereLike | null
  whereILike: whereILike | null
  where: where
  whereNull: string | null
  whereNotNull: string | null
  preload: preload[] | null
  withAggregate: withAggregate[]
  withCount: withCount[]
  join: Join[]
}

export default class BaseController {
  constructor(
    public model: LucidModel,
    public storeValidator: any,
    public updateValidator: any,
    private bauncerPolicy?: keyof PoliciesList,
    public perPage?: number,
    public importSelects: string[] = []
  ) {}

  public async index(ctx: HttpContextContract) {
    if (ctx.bouncer && this.bauncerPolicy) {
      await ctx.bouncer.with(this.bauncerPolicy).authorize('viewList')
    }

    const qs = qsModule.parse(ctx.request.parsedUrl.query, { depth: 10 })

    let records: ModelPaginatorContract<LucidRow> | LucidRow[] | [] = []
    const query = this.getIndexQuery(ctx)

    if (!query) {
      return ctx.response.custom({
        message: null,
        code: 200,
        data: records,
        success: true,
      })
    }

    const filteredQuery = this.indexfilterQuery(qs, query)

    if (qs.page) {
      records = await filteredQuery.paginate(qs.page, Number(qs?.rowsPerPage) || this.perPage)
    } else {
      records = await filteredQuery.exec()
    }

    return ctx.response.custom({
      message: null,
      code: 200,
      data: records,
      success: true,
    })
  }

  public async show(ctx: HttpContextContract) {
    const qs = qsModule.parse(ctx.request.parsedUrl.query, { depth: 10 })

    const query = this.getShowQuery(ctx)

    if (!query) {
      return ctx.response.custom({
        message: null,
        code: 200,
        data: null,
        success: true,
      })
    }

    const filteredQuery = this.showfilterQuery(qs, query)

    const record = await filteredQuery.first()

    if (record && ctx.bouncer && this.bauncerPolicy) {
      await ctx.bouncer.with(this.bauncerPolicy).authorize('view', record)
    }

    return ctx.response.custom({
      message: null,
      code: 200,
      data: record,
      success: true,
    })
  }

  public async store(ctx: HttpContextContract) {
    if (ctx.bouncer && this.bauncerPolicy) {
      await ctx.bouncer.with(this.bauncerPolicy).authorize('create')
    }
    const payload = await ctx.request.validate(this.storeValidator)
    const record = await this.model.create(payload)
    return ctx.response.custom({
      message: 'Record Created Successfully',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update(ctx: HttpContextContract) {
    const id = +ctx.params.id
    const record = await this.model.findOrFail(id)
    if (ctx.bouncer && this.bauncerPolicy) {
      await ctx.bouncer.with(this.bauncerPolicy).authorize('update', record)
    }
    const payload = await ctx.request.validate(this.updateValidator)
    record?.merge(payload)
    await record?.save()
    return ctx.response.custom({
      message: 'Record Updated Successfully',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async destroy(ctx: HttpContextContract) {
    const id = +ctx.params.id
    const record = await this.model.findOrFail(id)
    if (ctx.bouncer && this.bauncerPolicy) {
      await ctx.bouncer.with(this.bauncerPolicy).authorize('delete', record)
    }

    await record?.delete()
    return ctx.response.custom({
      message: 'Record Deleted Successfully',
      code: 200,
      data: record,
      success: true,
    })
  }

  public async uniqueField(ctx: HttpContextContract) {
    const qs = ctx.request.qs() as { field: string; value: string }
    const record = await this.model.findBy(qs.field, qs.value)

    if (record) {
      return ctx.response.custom({
        message: 'Field is already taken',
        code: 400,
        data: null,
        success: false,
      })
    } else {
      return ctx.response.custom({
        message: 'The field is available',
        code: 200,
        data: null,
        success: true,
      })
    }
  }

  public indexfilterQuery(qs: IndexQs, query: ModelQueryBuilderContract<any, any>) {
    if (qs.preload) {
      this.preload(qs.preload, query)
    }

    if (qs?.sortBy) {
      if (qs.descending === 'true') {
        query.orderBy(qs.sortBy, 'desc')
      } else if (qs.descending === 'false') {
        query.orderBy(qs.sortBy, 'asc')
      } else {
        query.orderBy(qs.sortBy, 'asc')
      }
    }

    if (qs?.where) {
      this.where(qs.where, query)
    }

    if (qs?.whereNotNull) {
      query.whereNotNull(qs.whereNotNull)
    }

    if (qs?.whereNull) {
      query.whereNull(qs.whereNull)
    }

    if (qs?.whereLike) {
      for (const key in qs.whereLike) {
        const value = qs.whereLike[key]

        query.whereLike(key, value)
      }
    }

    if (qs?.whereILike) {
      for (const key in qs.whereILike) {
        const value = qs.whereILike[key]
        query.whereILike(key, value)
      }
    }

    if (qs.join && qs.join.length > 0) {
      qs.join.forEach((j) => {
        if (j.length > 0) {
          query.join(j[0], j[1], j[2])
        }
      })
    }

    if (qs?.select) {
      query.select(qs.select)
    }

    if (qs?.withAggregate) {
      for (const item of qs?.withAggregate) {
        query.withAggregate(item.relation, (b: any) => {
          b[item.aggregator](item.field).as(item.as)
        })
      }
    }

    if (qs.withCount) {
      for (const item of qs?.withCount) {
        query.withCount(item.relation, (b) => {
          b.as(item.as)
        })
      }
    }

    return query
  }

  public showfilterQuery(qs: IndexQs, query: ModelQueryBuilderContract<any, any>) {
    return this.indexfilterQuery(qs, query)
  }

  public preload(preload: preload[], query: ModelQueryBuilderContract<any>) {
    for (const perloadItem of preload) {
      for (const key in perloadItem) {
        const element = perloadItem[key]

        query.preload(key, (builder) => {
          if (element?.select) {
            builder.select(element.select)
          }

          if (element?.where) {
            this.where(element.where, builder)
          }

          if (element?.withAggregate) {
            for (const item of element?.withAggregate) {
              builder.withAggregate(item.relation, (b: any) => {
                b[item.aggregator](item.field).as(item.as)
              })
            }
          }

          if (element?.withCount) {
            for (const item of element?.withCount) {
              builder.withCount(item.relation, (b) => {
                b.as(item.as)
              })
            }
          }

          if (element?.sortBy) {
            if (element?.descending === 'true') {
              builder.orderBy(element.sortBy, 'desc')
            } else if (element?.descending === 'false') {
              builder.orderBy(element.sortBy, 'asc')
            } else {
              builder.orderBy(element.sortBy, 'asc')
            }
          }

          if (element.limit) {
            builder.limit(element.limit)
          }

          if (element.preload) {
            this.preload(element.preload, builder)
          }
        })
      }
    }
  }

  public where(where: where, query: ModelQueryBuilderContract<any>) {
    for (const key in where) {
      const element = where[key]
      query.where(key, element[0], element[1])
    }
  }

  public async export(ctx: HttpContextContract) {
    this.bauncerPolicy && (await ctx.bouncer.with(this.bauncerPolicy).authorize('viewList'))

    const records = await this.getExportRecords()

    const data = records.map((r) => {
      const data = flatten(convertKeysToCamelCase(r.serialize()))
      return this.excludeIncludeExportProperties(data)
    })

    const workbook = XLSX.utils.book_new()

    const worksheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet, this.model.name)
    XLSX.writeFile(workbook, Application.tmpPath(`uploads/${this.model.name}.xlsx`), {
      bookType: 'xlsx',
      type: 'file',
    })

    const url = await Drive.getSignedUrl(`${this.model.name}.xlsx`, { expiresIn: '30mins' })

    return ctx.response.custom({
      message: 'Export Successfull',
      code: 200,
      data: { url },
      success: true,
    })
  }

  public async import(ctx: HttpContextContract) {
    this.bauncerPolicy && (await ctx.bouncer.with(this.bauncerPolicy).authorize('create'))
    const validatorSchema = schema.create({
      file: schema.file({ extnames: ['xlsx'] }),
    })

    const { file } = await ctx.request.validate({ schema: validatorSchema })

    await file.moveToDisk('./', {
      name: `${this.model.name}.xlsx`,
    })

    const book = XLSX.readFile(Application.tmpPath(`uploads/${this.model.name}.xlsx`))
    const sheet = book.Sheets[this.model.name]
    const json = XLSX.utils.sheet_to_json(sheet)

    for (const j of json as any) {
      const deflattenObject = unflatten(j)
      await this.storeExcelData(deflattenObject, ctx.request.ctx as HttpContextContract)
    }

    return ctx.response.custom({
      message: 'File upload Successfull! Refresh your page',
      code: 201,
      data: null,
      success: true,
    })
  }

  public async getExportRecords() {
    const records = await this.model.all()
    return records
  }

  public async storeExcelData(data: any, ctx: HttpContextContract) {
    ctx.meta = {
      currentObjectId: data.id,
    }
    const validatedData = await validator.validate({
      schema: new this.updateValidator(ctx, data.id).schema,
      data: data,
    })
    await this.model.updateOrCreate({ id: validatedData.id }, validatedData)
  }

  public excludeIncludeExportProperties(record: any) {
    return record
  }

  public getIndexQuery(ctx: HttpContextContract): ModelQueryBuilderContract<any, any> | null {
    return this.model.query()
  }

  public getShowQuery(ctx: HttpContextContract): ModelQueryBuilderContract<any, any> | null {
    const id = ctx.params.id
    return this.model.query().where('id', id)
  }
}
