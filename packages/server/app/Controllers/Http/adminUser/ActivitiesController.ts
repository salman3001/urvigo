// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Activity from 'App/Models/Activity'
import BaseController from '../BaseController'

export default class ActivitiesController extends BaseController {
  constructor() {
    super(Activity, {}, {}, 'AdminUserPolicy')
  }
}
