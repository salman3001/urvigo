import Route from '@ioc:Adonis/Core/Route'

// Route.group(() => {
//   // orders
//   Route.post('orders/summary', 'orders/OrdersController.summary')
//   Route.get('orders/get-coupons', 'orders/OrdersController.getCoupons')
//   Route.get('orders/customer-orders', 'orders/OrdersController.customerOrdersList')
//   Route.get('orders/vendor-orders', 'orders/OrdersController.venodrOrdersList')
//   Route.put('orders/:id/update-status', 'orders/OrdersController.updateStatus')
//   Route.resource('orders', 'orders/OrdersController').only(['index', 'store'])

//   Route.get('bid-orders/my-list', 'orders/BidOrdersController.myList')
//   Route.post('bid-orders/:id/update-status', 'orders/BidOrdersController.updateStatus')
//   Route.resource('bid-orders', 'orders/BidOrdersController').only(['index', 'store', 'show'])

//   // coupons
//   Route.get('coupons/vendor-coupons', 'orders/CouponsController.vendorCoupons')
//   // Route.post('coupons/:id/apply-to-services', 'CouponsController.applyToServices')
//   Route.put('coupons/:id/update-services', 'orders/CouponsController.updateServices')
//   Route.resource('coupons', 'CouponsController')
// }).prefix('api')
