import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // bookings
  Route.post('bookings/summary', 'booking/BookingController.summary')
  Route.get('bookings/get-coupons', 'booking/BookingController.getCoupons')
  Route.get('bookings/customer-bookings', 'booking/BookingController.customerBookingList')
  Route.get('bookings/vendor-bookings', 'booking/BookingController.venodrBookingList')
  Route.put('bookings/:id/update-status', 'booking/BookingController.updateStatus')
  Route.resource('bookings', 'booking/BookingController').only(['index', 'store', 'show'])

  Route.get('bid-bookings/my-list', 'booking/BidBookingController.myList')
  Route.put('bid-bookings/:id/update-status', 'booking/BidBookingController.updateStatus')
  Route.resource('bid-bookings', 'booking/BidBookingController').only(['index', 'store', 'show'])

  // coupons
  Route.post('coupons/:id', 'booking/CouponsController.updateStatus')
  Route.resource('coupons', 'booking/CouponsController')
}).prefix('api')
