import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { OrderStatus } from 'App/Helpers/enums'

export default class extends BaseSchema {
  protected tableName = 'bid_orders'

  public async up() {
    // this.schema.createTable(this.tableName, (table) => {
    //   table.increments('id').primary()
    //   table
    //     .integer('vendor_user_id', 10)
    //     .unsigned()
    //     .references('id')
    //     .inTable('vendor_users')
    //     .onDelete('SET NULL')
    //   table.integer('user_id', 10).unsigned().references('id').inTable('users').onDelete('SET NULL')
    //   table.decimal('price', 10, 2)
    //   table.json('order_detail')
    //   table.json('payment_detail')
    //   table.enum('status', Object.values(OrderStatus)).notNullable().defaultTo(OrderStatus.PLACED)
    //   /**
    //    * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
    //    */
    //   table.timestamp('created_at', { useTz: true })
    //   table.timestamp('updated_at', { useTz: true })
    // })
  }

  public async down() {
    // this.schema.raw('DROP TYPE IF EXISTS "status"')
    // this.schema.dropTable(this.tableName)
  }
}
