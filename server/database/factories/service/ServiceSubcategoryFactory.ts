import ServiceSubcategory from 'App/Models/service/ServiceSubcategory'
import Factory from '@ioc:Adonis/Lucid/Factory'
import FaqFactory from '../FaqFactory'
import ServiceCategoryFactory from './ServiceCategoryFactory'
import SeoFactory from '../SeoFactory'
import ServiceFactory from './ServiceFactory'

export default Factory.define(ServiceSubcategory, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    slug: faker.lorem.slug(),
    shortDesc: faker.lorem.paragraph(),
    longDesc: faker.lorem.paragraphs(),
    status: false,
  }
})
  .relation('faqs', () => FaqFactory)
  .relation('serviceCategory', () => ServiceCategoryFactory)
  .relation('services', () => ServiceFactory)
  .relation('seo', () => SeoFactory)
  .build()
