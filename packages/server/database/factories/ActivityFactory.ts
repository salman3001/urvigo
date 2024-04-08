import Activity from 'App/Models/Activity'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Activity, ({ faker }) => {
  return {
    name: faker.lorem.lines(1),
  }
}).build()
