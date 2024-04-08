import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'images'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.json('file')

      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')

      table
        .integer('vendor_profile_id')
        .unsigned()
        .references('id')
        .inTable('vendor_profiles')
        .onDelete('CASCADE')

      table
        .integer('service_requirement_id')
        .unsigned()
        .references('id')
        .inTable('service_requirements')
        .onDelete('CASCADE')

      table.integer('media_id').unsigned().references('id').inTable('media').onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
