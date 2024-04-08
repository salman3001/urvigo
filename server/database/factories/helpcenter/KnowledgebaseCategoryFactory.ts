import KnowledgebaseCategory from 'App/Models/helpcenter/KnowledgeBaseCategory'
import Factory from '@ioc:Adonis/Lucid/Factory'
import KnowledgebaseContentFactory from './KnowledgebaseContentFactory'

export default Factory.define(KnowledgebaseCategory, ({ faker }) => {
  return {
    name: faker.lorem.words(1),
    slug: faker.lorem.slug(5),
    metaTitle: faker.lorem.lines(1),
    metaDesc: faker.lorem.lines(1),
    metaKeywords: faker.lorem.words(5),
  }
})
  .relation('contents', () => KnowledgebaseContentFactory)
  .build()
