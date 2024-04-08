import VendorProfile from 'App/Models/vendorUser/VendorProfile'
import Factory from '@ioc:Adonis/Lucid/Factory'
import AddressFactory from '../address/AddressFactory'
import FaqFactory from '../FaqFactory'
import SocialFactory from '../SocialFactory'

export default Factory.define(VendorProfile, ({ faker }) => {
  return {
    name: faker.lorem.words(2),
    isActive: true,
    shortDesc: faker.lorem.sentence(),
    longDesc: faker.lorem.paragraph(),
  }
})
  .relation('addresses', () => AddressFactory)
  .relation('faq', () => FaqFactory)
  .relation('social', () => SocialFactory)
  .build()
