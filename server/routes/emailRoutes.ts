import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('template/export', 'email/TemplatesController.export')
  Route.post('template/import', 'email/TemplatesController.import')
  Route.resource('template', 'email/TemplatesController').apiOnly()

  Route.get('campaign/export', 'email/CampaignsController.export')
  Route.post('campaign/import', 'email/CampaignsController.import')
  Route.resource('campaign', 'email/CampaignsController').apiOnly()

  Route.get('campaign-type/export', 'email/CampaignTypesController.export')
  Route.post('campaign-type/import', 'email/CampaignTypesController.import')
  Route.resource('campaign-type', 'email/CampaignTypesController').apiOnly()

  Route.get('interest/export', 'email/InterestController.export')
  Route.post('interest/import', 'email/InterestController.import')
  Route.resource('interest', 'email/InterestController').apiOnly()

  Route.get('subscriber/export', 'email/SubscribersController.export')
  Route.post('subscriber/import', 'email/SubscribersController.import')
  Route.get('subscriber/unique-field', 'email/SubscribersController.uniqueField')
  Route.resource('subscriber', 'email/SubscribersController').apiOnly()
}).prefix('api')
