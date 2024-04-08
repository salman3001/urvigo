import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, afterCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './user/User'
import VendorUser from './vendorUser/VendorUser'
import Service from './service/Service'
import BigNumber from 'bignumber.js'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({
    serialize: (v) => new BigNumber(v || 0).toFixed(1),
  })
  public rating: number

  @column()
  public message: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public vendorUserId: number

  @column()
  public serviceId: number

  @belongsTo(() => VendorUser)
  public vendorUser: BelongsTo<typeof VendorUser>

  @belongsTo(() => Service)
  public service: BelongsTo<typeof Service>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static async setAvgRating(review: Review) {
    if (review.serviceId) {
      const service = await Service.query()
        .where('id', review.serviceId)
        .withAggregate('reviews', (b) => {
          b.avg('rating').as('service_avg_rating')
        })
        .first()

      if (service) {
        const avg_rating = new BigNumber(service.$extras?.service_avg_rating || 0).toFixed(1)
        service.avgRating = avg_rating
        await service.save()

        const vendor = await VendorUser.query()
          .where('id', service.vendorUserId)
          .withAggregate('services', (s) => {
            s.avg('avg_rating').as('service_avg_rating')
          })
          .withAggregate('reviews', (b) => {
            b.avg('rating').as('vendor_avg_rating')
          })
          .first()

        if (vendor) {
          const avg_rating = new BigNumber(vendor.$extras?.service_avg_rating || 0)
            .plus(vendor.$extras?.vendor_avg_rating || 0)
            .dividedBy(2)
            .toFixed(1)

          vendor.avgRating = avg_rating
          await vendor.save()
        }
      }
    }

    if (review.vendorUserId) {
      const vendor = await VendorUser.query()
        .where('id', review.vendorUserId)
        .withAggregate('services', (s) => {
          s.avg('avg_rating').as('service_avg_rating')
        })
        .withAggregate('reviews', (b) => {
          b.avg('rating').as('vendor_avg_rating')
        })
        .first()

      if (vendor) {
        const avg_rating = new BigNumber(vendor.$extras?.service_avg_rating || 0)
          .plus(vendor.$extras?.vendor_avg_rating || 0)
          .dividedBy(2)
          .toFixed(1)

        vendor.avgRating = avg_rating
        await vendor.save()
      }
    }
  }
}
