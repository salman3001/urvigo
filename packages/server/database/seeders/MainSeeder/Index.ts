// import Application from '@ioc:Adonis/Core/Application'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AdminUserFactory from 'Database/factories/adminUser/AdminUserFactory'
import ContactMessageFactory from 'Database/factories/helpcenter/ContactMessageFactory'
import BlogCategoryFactory from 'Database/factories/blogs/BlogCategoryFactory'
import KnowledgebaseCategoryFactory from 'Database/factories/helpcenter/KnowledgebaseCategoryFactory'
import RoleFactory from 'Database/factories/adminUser/RoleFactory'
import UserFactory from 'Database/factories/user/UserFactory'
import SupportTicketFactory from 'Database/factories/helpcenter/SupportTicketFactory'
import { TicketStatus, permissions } from 'App/Helpers/enums'
import ServiceCategoryFactory from 'Database/factories/service/ServiceCategoryFactory'
import CampaignTypeFactory from 'Database/factories/email/CampaignTypeFactory'
import TemplateFactory from 'Database/factories/email/TemplateFactory'
import VendorUserFactory from 'Database/factories/vendorUser/VendorUserFactory'
import LanguageFactory from 'Database/factories/LanguageFactory'
import ServiceTagFactory from 'Database/factories/service/ServiceTagFactory'

export default class extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    // if (
    //   (!Seeder.default.environment.includes('development') && Application.inDev) ||
    //   (!Seeder.default.environment.includes('testing') && Application.inTest) ||
    //   (!Seeder.default.environment.includes('serviceion') && Application.inProduction)
    // ) {
    //   return
    // }
    await new Seeder.default(this.client).run()
  }
  public async run() {
    const permissionsObject: any[] = []

    for (const perm of Object.values(permissions)) {
      permissionsObject.push(perm)
    }

    await RoleFactory.merge([
      { name: 'Super Admin', isActive: true, permissions: permissionsObject },
      { name: 'Moderator' },
    ]).createMany(3)

    await AdminUserFactory.merge([{ email: 'admin@gmail.com', isActive: true, roleId: 1 }])
      .with('activities', 3)
      .with('blogs', 2, (b) => {
        b.merge({ isPublished: true })
      })
      .createMany(14)

    // service
    await ServiceCategoryFactory.with('subCategory', 3, (sub) => {
      sub.with('faqs', 3).with('seo')
    })
      .with('faqs', 3)
      .with('seo')
      .createMany(3)

    await VendorUserFactory.merge([{ email: 'vendor@gmail.com', isActive: true }])
      .with('services', 7, (p) => {
        p.merge({ isActive: true, serviceCategoryId: 1 })
        p.with('variants', 2)
        p.with('faq')
      })
      .with('blogs', 3, (b) => {
        b.merge({ isPublished: true })
      })
      .createMany(8)

    await UserFactory.merge([
      { email: 'user@gmail.com', password: '123456789', isActive: true },
    ]).createMany(10)

    await BlogCategoryFactory.with('blogs', 3).createMany(2)
    await KnowledgebaseCategoryFactory.with('contents', 5).createMany(3)
    await ContactMessageFactory.createMany(15)
    await SupportTicketFactory.merge([
      { status: TicketStatus.CLOSED },
      { status: TicketStatus.CLOSED },
      { status: TicketStatus.CLOSED },
      { status: TicketStatus.RESPONDED },
      { status: TicketStatus.RESPONDED },
      { status: TicketStatus.RESPONDED },
    ]).createMany(9)

    // campaign
    await CampaignTypeFactory.with('campaign', 3, (c) => {
      c.with('interests', 3, (i) => {
        i.with('subscribers', 3)
      })
    }).createMany(3)

    await TemplateFactory.merge({
      name: 'Forgot Password Email',
      content:
        'Forgot Your Password! Dont Worry. Here is your 6 digts code {{otp}}, Use it to reset the password',
    }).create()

    await LanguageFactory.createMany(10)
    await ServiceTagFactory.createMany(10)
  }
}
