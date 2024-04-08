import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout')
  Route.post('signup', 'AuthController.signup')
  Route.post('get-otp', 'AuthController.sendForgotPasswordOtp')
  Route.post('verify-otp-update-password', 'AuthController.vaerifyOtpAndUpdatePassword')
  Route.post('update-password/:id', 'AuthController.updateUserPassword')
}).prefix('api/auth')
