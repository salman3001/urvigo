import ServiceCategory from 'App/Models/service/ServiceCategory'
import Factory from '@ioc:Adonis/Lucid/Factory'
import FaqFactory from '../FaqFactory'
import SeoFactory from '../SeoFactory'
import ServiceFactory from './ServiceFactory'
import ServiceSubcategoryFactory from './ServiceSubcategoryFactory'

export default Factory.define(ServiceCategory, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    slug: faker.lorem.slug(),
    shortDesc: faker.lorem.paragraph(),
    longDesc: faker.lorem.paragraphs(),
    status: false,
  }
})
  .relation('faqs', () => FaqFactory)
  .relation('seo', () => SeoFactory)
  .relation('services', () => ServiceFactory)
  .relation('subCategory', () => ServiceSubcategoryFactory)
  .build()
