import VendorUser from 'App/Models/vendorUser/VendorUser'
import Factory from '@ioc:Adonis/Lucid/Factory'
import ServiceFactory from '../service/ServiceFactory'
import VendorProfileFactory from './VendorProfileFactory'
import BlogFactory from '../blogs/BlogFactory'

export default Factory.define(VendorUser, ({ faker }) => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    businessName: faker.commerce.department(),
    password: '123456789',
    email: faker.internet.email(),
    phone: faker.number.int({ max: 999999999, min: 111111111 }).toString(),
    isActive: false,
  }
})
  .relation('services', () => ServiceFactory)
  .relation('profile', () => VendorProfileFactory)
  .relation('blogs', () => BlogFactory)
  .build()
