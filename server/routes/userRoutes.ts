import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('users/export', 'user/UsersController.export')
  Route.post('users/import', 'user/UsersController.import')
  Route.get('users/unique-field', 'user/UsersController.uniqueField')
  Route.post('users/ban/:id', 'user/UsersController.banUser')
  Route.post('users/update-password/:id', 'user/UsersController.updateUserPassword')

  Route.put('users/:id/update-profile', 'user/UsersController.updateProfile')
  Route.resource('users', 'user/UsersController').apiOnly()

  // cart
  // Route.get('my-cart', 'user/CartsController.show')
  // Route.put('update-my-cart', 'user/CartsController.update')
  // Route.delete('my-cart/:itemId', 'user/CartsController.deleteItem')
  // Route.delete('my-cart', 'user/CartsController.clear')

  Route.get('my-wishlist/detailed', 'user/WishlistsController.showDetailList')
  Route.get('my-wishlist/:nullId', 'user/WishlistsController.show')
  Route.post('my-wishlist/add-item', 'user/WishlistsController.add')
  Route.put('update-my-wishlist', 'user/WishlistsController.update')
  Route.delete('my-wishlist/:itemId', 'user/WishlistsController.deleteItem')
  Route.delete('my-wishlist', 'user/WishlistsController.clear')
}).prefix('api')
