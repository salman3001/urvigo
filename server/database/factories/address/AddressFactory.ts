import Address from 'App/Models/address/Address'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Address, ({ faker }) => {
  return {
    address: faker.lorem.lines(1),
    geoLocation: `${faker.location.longitude()},${faker.location.latitude()}`,
  }
}).build()
