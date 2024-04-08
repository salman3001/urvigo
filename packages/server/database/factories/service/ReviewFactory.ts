import Review from 'App/Models/Review'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Review, ({ faker }) => {
  return {
    message: faker.lorem.lines(2),
    rating: 4,
  }
}).build()
