import BaseController from './BaseController'
import Language from 'App/Models/Language'

export default class LanguageController extends BaseController {
  constructor() {
    super(Language, {}, {})
  }
}
