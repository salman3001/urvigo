import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import ConversationParticipant from './ConversationParticipant'
import Message from './Message'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public participantOneIdentifier: string

  @column()
  public participantTwoIdentifier: string

  @column()
  public participantOneId: number

  @column()
  public participantTwoId: number

  @belongsTo(() => ConversationParticipant, {
    foreignKey: 'participantOneId',
  })
  public participantOne: BelongsTo<typeof ConversationParticipant>

  @belongsTo(() => ConversationParticipant, {
    foreignKey: 'participantTwoId',
  })
  public participantTwo: BelongsTo<typeof ConversationParticipant>

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
