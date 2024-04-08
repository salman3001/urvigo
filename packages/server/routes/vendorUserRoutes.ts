import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('vendor-users/export', 'vendorUser/VendorUsersController.export')
  Route.post('vendor-users/import', 'vendorUser/VendorUsersController.import')
  Route.get('vendor-users/unique-field', 'vendorUser/VendorUsersController.uniqueField')
  Route.get('vendor-users/:id/get-rating', 'vendorUser/VendorUsersController.getVendorRating')
  Route.post('vendor-users/ban/:id', 'vendorUser/VendorUsersController.banUser')
  Route.post(
    'vendor-users/subscribe-bid-catrgories',
    'vendorUser/VendorUsersController.updateSubscribedCategories'
  )
  Route.post(
    'vendor-users/update-password/:id',
    'vendorUser/VendorUsersController.updateUserPassword'
  )

  // update profile
  Route.put('vendor-users/:id/update-profile', 'vendorUser/VendorUsersController.updateProfile')

  //vendor reviews
  Route.get('/vendor-users/:id/reviews', 'vendorUser/VendorUsersController.getReviews')
  Route.post('/vendor-users/:id/reviews', 'vendorUser/VendorUsersController.create_review')

  Route.resource('vendor-users', 'vendorUser/VendorUsersController').apiOnly()
}).prefix('api')
