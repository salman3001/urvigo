import Language from 'App/Models/Language'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Language, ({ faker }) => {
  return {
    name: faker.location.country(),
  }
}).build()
