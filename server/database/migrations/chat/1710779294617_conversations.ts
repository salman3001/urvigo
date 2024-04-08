import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'conversations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('participant_one_identifier')
      table.string('participant_two_identifier')
      table
        .integer('participant_one_id')
        .unsigned()
        .references('id')
        .inTable('conversation_participants')
        .onDelete('cascade')
      table
        .integer('participant_two_id')
        .unsigned()
        .references('id')
        .inTable('conversation_participants')
        .onDelete('cascade')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
