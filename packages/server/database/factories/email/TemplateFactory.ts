import Templates from 'App/Models/email/Template'
import Factory from '@ioc:Adonis/Lucid/Factory'
import CampaignFactory from './CampaignFactory'

export default Factory.define(Templates, ({ faker }) => {
  return {
    name: faker.lorem.word(8),
    desc: faker.lorem.paragraph(),
    content: faker.lorem.paragraphs(),
  }
})
  .relation('campaign', () => CampaignFactory)
  .build()
