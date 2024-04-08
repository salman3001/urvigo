import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'vendor_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password').notNullable()
      table.string('first_name')
      table.string('last_name')
      table.string('business_name').notNullable()
      table.string('phone', 15)
      table.boolean('is_active').defaultTo(false).notNullable()
      table.decimal('avg_rating', 2, 1).defaultTo(0)
      table.string('token').nullable()
      table.string('socket_token').nullable()
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
