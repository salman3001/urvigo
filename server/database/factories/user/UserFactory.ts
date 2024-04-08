import User from 'App/Models/user/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    isActive: false,
    password: '123456789',
    phone: '9999999999',
  }
}).build()
