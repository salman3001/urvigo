import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'blogs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').unique().notNullable()
      table.string('slug', 300).unique().notNullable()
      table.boolean('is_published').defaultTo(0)
      table.json('thumbnail')
      table
        .integer('vendor_user_id')
        .unsigned()
        .references('id')
        .inTable('vendor_users')
        .onDelete('CASCADE')
      table
        .integer('admin_user_id')
        .unsigned()
        .references('id')
        .inTable('admin_users')
        .onDelete('CASCADE')
      table
        .integer('language_id')
        .unsigned()
        .references('id')
        .inTable('languages')
        .onDelete('SET NULL')
      table.string('short_desc', 512)
      table.text('long_desc')
      table.string('meta_title')
      table.string('meta_keywords')
      table.string('meta_desc', 512)

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
