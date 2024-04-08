/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import '../routes/adminRoutes'
import '../routes/authRoutes'
import '../routes/addressRoutes'
import '../routes/helpcenterRoutes'
import '../routes/blogRoutes'
import '../routes/userRoutes'
import '../routes/vendorUserRoutes'
import '../routes/serviceRoutes'
import '../routes/emailRoutes'
import '../routes/notificationRoutes'
import '../routes/bookingRoutes'
import '../routes/bidRoutes'
import '../routes/chatRoutes'

Route.get('api', async ({ response }) => {
  console.log('api ran')

  return response.json('welcome to backend api')
})

// other

Route.group(() => {
  Route.resource('language', 'LanguageController')
  Route.resource('media', 'MediaController')
}).prefix('api')

Route.get('/email', ({ view }) => {
  return view.render('emails/layout')
})
