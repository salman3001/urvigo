import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('address', 500)
      table.point('geo_location')
      table
        .integer('vendor_profile_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('vendor_profiles')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
