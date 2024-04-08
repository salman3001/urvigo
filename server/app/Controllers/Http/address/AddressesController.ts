// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from '../BaseController'
import Address from 'App/Models/address/Address'

export default class AddressesController extends BaseController {
  constructor() {
    super(Address, {}, {})
  }
}
