import AdminUser from 'App/Models/adminUser/AdminUser'
import Factory from '@ioc:Adonis/Lucid/Factory'
import RoleFactory from './RoleFactory'
import ActivityFactory from '../ActivityFactory'
import UserProfileFactory from '../UserProfileFactory'
import BlogFactory from '../blogs/BlogFactory'

export default Factory.define(AdminUser, ({ faker }) => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: '123456789',
    email: faker.internet.email(),
    phone: faker.number.int({ max: 999999999, min: 111111111 }).toString(),
    isActive: false,
    roleId: faker.number.int({ min: 2, max: 3 }),
  }
})
  .relation('profile', () => UserProfileFactory)
  .relation('role', () => RoleFactory)
  .relation('activities', () => ActivityFactory)
  .relation('blogs', () => BlogFactory)
  .build()
