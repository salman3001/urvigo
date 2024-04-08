import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { PaymentStatus } from 'App/Helpers/enums'

export default class extends BaseSchema {
  protected tableName = 'payments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('amount', 15).notNullable()
      table.string('amount_paid', 15).notNullable()
      table.string('amount_due', 15).notNullable()
      table.string('currency', 8).notNullable()
      table.enum('status', Object.values(PaymentStatus))
      table.json('gateway_data').notNullable()
      table
        .integer('booking_id', 10)
        .unsigned()
        .references('id')
        .inTable('bookings')
        .onDelete('SET NULL')
      table
        .integer('bid_booking_id', 10)
        .unsigned()
        .references('id')
        .inTable('bid_bookings')
        .onDelete('SET NULL')
      table
        .integer('vendor_user_id', 10)
        .unsigned()
        .references('id')
        .inTable('vendor_users')
        .onDelete('SET NULL')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
