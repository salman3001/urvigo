import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { CouponType, DiscountType } from 'App/Helpers/enums'

export default class extends BaseSchema {
  protected tableName = 'coupons'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 50)
      table.string('desc')
      table.boolean('is_active').defaultTo(false)
      table.enum('coupon_type', Object.values(CouponType)).notNullable()
      table.enum('discount_type', Object.values(DiscountType)).notNullable()
      table.decimal('discount_flat', 10, 2).defaultTo(0)
      table.decimal('discount_percentage', 4, 2).defaultTo(0)
      table.integer('max_users').notNullable().defaultTo(0)
      table.decimal('min_purchase_amount', 10, 2)
      table.dateTime('valid_from').notNullable()
      table.dateTime('expired_at').notNullable()
      table
        .integer('vendor_user_id')
        .unsigned()
        .references('id')
        .inTable('vendor_users')
        .onDelete('CASCADE')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.raw('DROP TYPE IF EXISTS "coupon_type"')
    this.schema.raw('DROP TYPE IF EXISTS "discount_type"')
    this.schema.dropTable(this.tableName)
  }
}
