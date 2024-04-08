import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('service-requirements/my-list', 'bid/ServiceRequirementController.myList')
  Route.get('service-requirements/:id/show-bids', 'bid/ServiceRequirementController.showBids')
  Route.get(
    'service-requirements/:id/accepted-bid',
    'bid/ServiceRequirementController.showAcceptedBid'
  )
  Route.post(
    'service-requirements/:id/negotiate-price',
    'bid/ServiceRequirementController.negotiate'
  )
  Route.get(
    'service-requirements/:id/show-vendor-placed-bid',
    'bid/ServiceRequirementController.showVendorPlacedbid'
  )
  Route.resource('service-requirements', 'bid/ServiceRequirementController').apiOnly()
  Route.put('bids/:id/accept-negotiate', 'bid/BidController.acceptNegotiation')
  Route.resource('bids', 'bid/BidController').apiOnly()
}).prefix('api')
