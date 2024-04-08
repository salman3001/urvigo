import Campaign from 'App/Models/email/Campaign'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'
import InterestFactory from './InterestFactory'
import TemplateFactory from './TemplateFactory'

export default Factory.define(Campaign, ({ faker }) => {
  return {
    name: faker.lorem.word(),
    subject: faker.lorem.lines(1),
    fromName: faker.internet.userName(),
    fromEmail: faker.internet.email(),
    replyTo: faker.internet.email(),
    status: false,
    deliveryDateTime: DateTime.now(),
  }
})
  .relation('interests', () => InterestFactory)
  .relation('template', () => TemplateFactory)
  .build()
