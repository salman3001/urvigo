import Skill from 'App/Models/user/Skill'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Skill, ({ faker }) => {
  return {
    name: faker.lorem.word(),
  }
}).build()
