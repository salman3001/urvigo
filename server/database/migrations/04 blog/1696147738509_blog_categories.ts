import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'blog_categories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').unique().notNullable()
      table.string('slug', 300).unique().notNullable()
      table.bigInteger('order').defaultTo(1).notNullable()
      table.boolean('status').defaultTo(false)
      table
        .integer('language_id')
        .unsigned()
        .references('id')
        .inTable('languages')
        .onDelete('SET NULL')

      table.string('meta_title')
      table.string('meta_keywords')
      table.string('meta_desc', 512)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
