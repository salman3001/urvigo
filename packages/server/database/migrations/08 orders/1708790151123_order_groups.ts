import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'order_groups'

  public async up() {
    // this.schema.createTable(this.tableName, (table) => {
    //   table.increments('id')
    //   table.integer('user_id', 10).unsigned().references('id').inTable('users').onDelete('SET NULL')
    //   table.json('order_group_detail')
    //   table.json('payment_detail')
    //   /**
    //    * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
    //    */
    //   table.timestamp('created_at', { useTz: true })
    //   table.timestamp('updated_at', { useTz: true })
    // })
  }

  public async down() {
    // this.schema.dropTable(this.tableName)
  }
}
