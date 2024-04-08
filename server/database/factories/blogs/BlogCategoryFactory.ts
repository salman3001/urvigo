import Factory from '@ioc:Adonis/Lucid/Factory'
import BlogFactory from './BlogFactory'
import BlogCategory from 'App/Models/blogs/BlogCategory'

export default Factory.define(BlogCategory, ({ faker }) => {
  return {
    name: faker.lorem.word(),
    slug: faker.lorem.slug(5),
    metaTitle: faker.lorem.lines(1),
    metaDesc: faker.lorem.lines(1),
    metaKeywords: faker.lorem.words(5),
  }
})
  .relation('blogs', () => BlogFactory)
  .build()
