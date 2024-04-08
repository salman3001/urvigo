import UserProfile from 'App/Models/UserProfile'
import Factory from '@ioc:Adonis/Lucid/Factory'
import LanguageFactory from './LanguageFactory'
import SkillFactory from './user/SkillFactory'
import SocialFactory from './SocialFactory'

export default Factory.define(UserProfile, ({ faker }) => {
  return {}
})
  .relation('languages', () => LanguageFactory)
  .relation('skills', () => SkillFactory)
  .relation('social', () => SocialFactory)
  .build()
