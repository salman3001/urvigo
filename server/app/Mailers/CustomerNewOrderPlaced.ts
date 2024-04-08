import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Order from 'App/Models/orders/Order'
import User from 'App/Models/user/User'

export default class CustomerNewOrderPlaced extends BaseMailer {
  constructor(
    private user: User,
    private order: Order
  ) {
    super()
  }

  public async prepare(message: MessageContract) {
    // const template = await Template.findBy('name', 'Forgot Password Email')

    message
      .subject('Order placed successfully')
      .from('admin@urvigo.com')
      .to(this.user.email)
      .htmlView('emails/CustomerOrderPlaced', { user: this.user, order: this.order })
  }
}
