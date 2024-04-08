import Seo from 'App/Models/Seo'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Seo, ({ faker }) => {
  return {
    metaTitle: faker.lorem.words(3),
    metaKeywords: faker.lorem.words(5),
    metaDesc: faker.lorem.words(10),
  }
}).build()
