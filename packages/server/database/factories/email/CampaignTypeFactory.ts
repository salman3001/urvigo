import CampaignType from 'App/Models/email/CampaignType'
import Factory from '@ioc:Adonis/Lucid/Factory'
import CampaignFactory from './CampaignFactory'

export default Factory.define(CampaignType, ({ faker }) => {
  return {
    name: faker.lorem.word(6),
  }
})
  .relation('campaign', () => CampaignFactory)
  .build()
