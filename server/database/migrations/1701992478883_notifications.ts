import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Notifications extends BaseSchema {
  protected tableName = 'notifications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.json('data').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('admin_user_id')
        .unsigned()
        .references('id')
        .inTable('admin_users')
        .onDelete('CASCADE')
      table
        .integer('vendor_user_id')
        .unsigned()
        .references('id')
        .inTable('vendor_users')
        .onDelete('CASCADE')
      table.timestamp('read_at', { useTz: true })
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
