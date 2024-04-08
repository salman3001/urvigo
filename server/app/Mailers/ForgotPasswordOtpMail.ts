import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'
import Template from 'App/Models/email/Template'
import User from 'App/Models/user/User'

export default class ForgotPasswordOtpMail extends BaseMailer {
  constructor(private user: User) {
    super()
  }

  public async prepare(message: MessageContract) {
    const template = await Template.findBy('name', 'Forgot Password Email')

    const otp = Math.floor(100000 + Math.random() * 900000)
    this.user.token = otp.toString()
    await this.user.save()
    if (template) {
      const html = await View.renderRaw(template?.content, { otp })
      message
        .subject('Forgot Password Email')
        .from('admin@example.com')
        .to('user@example.com')
        .htmlView('emails/layout', { html })
    } else {
      message
        .subject('Forgot Password OTP')
        .from('admin@example.com')
        .to('user@example.com')
        .html(otp.toString())
    }
  }
}
