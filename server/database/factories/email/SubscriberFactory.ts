import Subscriber from 'App/Models/email/Subscriber'
import Factory from '@ioc:Adonis/Lucid/Factory'
import InterestFactory from './InterestFactory'

export default Factory.define(Subscriber, ({ faker }) => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.number.int({ max: 999999999, min: 111111111 }).toString(),
    status: false,
  }
})
  .relation('interests', () => InterestFactory)
  .build()
