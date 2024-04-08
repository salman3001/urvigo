import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { DiscountType } from 'App/Helpers/enums'

export default class extends BaseSchema {
  protected tableName = 'service_variants'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 100).notNullable()
      table.decimal('price', 12, 2).notNullable()
      table.enu('discount_type', Object.values(DiscountType)).defaultTo(0)
      table.decimal('discount_flat', 10, 2).defaultTo(0)
      table.decimal('discount_percentage', 4, 2).defaultTo(0)
      table.string('desc', 512)
      table.bigInteger('order').defaultTo(1).notNullable()
      table.json('image')
      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  public async down() {
    this.schema.raw('DROP TYPE IF EXISTS "discount_type"')
    this.schema.dropTable(this.tableName)
  }
}
