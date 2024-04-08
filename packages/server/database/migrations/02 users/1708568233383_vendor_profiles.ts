import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'vendor_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('short_desc', 500)
      table.text('long_desc')
      table.boolean('is_active')
      table.json('avatar')
      table.json('logo')
      table
        .integer('vendor_user_id')
        .unsigned()
        .notNullable()
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
    this.schema.dropTable(this.tableName)
  }
}
