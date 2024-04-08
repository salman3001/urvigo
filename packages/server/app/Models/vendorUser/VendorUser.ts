import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  HasOne,
  ManyToMany,
  afterCreate,
  beforeSave,
  column,
  computed,
  hasMany,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Notification from '../Notification'
import Hash from '@ioc:Adonis/Core/Hash'
import ServiceCategory from '../service/ServiceCategory'
import Booking from '../bookings/Booking'
import BidBooking from '../bookings/BidBooking'
import Review from '../Review'
import Service from '../service/Service'
import VendorProfile from './VendorProfile'
import BigNumber from 'bignumber.js'
import Conversation from '../chat/Conversation'
import { userTypes } from 'App/Helpers/enums'
import Blog from '../blogs/Blog'

export default class VendorUser extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public businessName: string

  @column()
  public phone: string

  @column()
  public isActive: boolean

  @column({
    serialize: (v) => new BigNumber(v || 0).toFixed(1),
  })
  public avgRating: string | number

  @column({ serializeAs: null })
  public token: string | null

  @column({ serializeAs: null })
  public socketToken: string

  @computed()
  public get userType() {
    return userTypes.VENDER
  }

  @hasMany(() => Blog)
  public blogs: HasMany<typeof Blog>

  @hasOne(() => VendorProfile)
  public profile: HasOne<typeof VendorProfile>

  @hasMany(() => Service)
  public services: HasMany<typeof Service>

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>

  @hasMany(() => Notification)
  public notifications: HasMany<typeof Notification>

  @manyToMany(() => ServiceCategory, {
    pivotTable: 'vendor_subscribed_categories',
  })
  public subscribedCategories: ManyToMany<typeof ServiceCategory>

  @hasMany(() => BidBooking)
  public bidBooking: HasMany<typeof BidBooking>

  @hasMany(() => Review)
  public reviews: HasMany<typeof Review>

  // @hasMany(() => SupportTicket)
  // public supportTickets: HasMany<typeof SupportTicket>

  // public async getRatting(){
  //   await this.load('')
  // }

  @manyToMany(() => Conversation, {
    pivotTable: 'conversation_participants',
  })
  public conversations: ManyToMany<typeof Conversation>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static async createProfile(user: VendorUser) {
    await user.related('profile').create({})
  }

  @beforeSave()
  public static async hashPassword(user: VendorUser) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
