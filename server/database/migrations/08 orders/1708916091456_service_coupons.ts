import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'service_coupons'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('coupon_id')
        .unsigned()
        .references('id')
        .inTable('coupons')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  public async down() {
    this.schema.raw('DROP TYPE IF EXISTS "coupon_type"')
    this.schema.raw('DROP TYPE IF EXISTS "discount_type"')
    this.schema.dropTable(this.tableName)
  }
}
