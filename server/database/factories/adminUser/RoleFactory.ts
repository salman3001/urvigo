import Role from 'App/Models/adminUser/Role'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Role, ({ faker }) => {
  return {
    name: faker.lorem.word(),
    permissions: [],
  }
}).build()
