// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from './BaseController'
import Social from 'App/Models/Social'

export default class SocialController extends BaseController {
  constructor() {
    super(Social, {}, {})
  }
}
