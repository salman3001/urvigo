import Interest from 'App/Models/email/Interest'
import Factory from '@ioc:Adonis/Lucid/Factory'
import CampaignFactory from './CampaignFactory'
import SubscriberFactory from './SubscriberFactory'

export default Factory.define(Interest, ({ faker }) => {
  return {
    name: faker.lorem.word(6),
  }
})
  .relation('campaigns', () => CampaignFactory)
  .relation('subscribers', () => SubscriberFactory)
  .build()
