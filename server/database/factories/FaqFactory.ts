import Faq from 'App/Models/Faq'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Faq, ({ faker }) => {
  return {
    quest: faker.lorem.words(10),
    ans: faker.lorem.paragraph(),
  }
}).build()
