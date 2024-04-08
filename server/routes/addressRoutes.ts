import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('continents/export', 'address/ContinentsController.export')
  Route.post('continents/import', 'address/ContinentsController.import')
  Route.resource('continents', 'address/ContinentsController').apiOnly()
  Route.get('countries/export', 'address/CountriesController.export')
  Route.post('countries/import', 'address/CountriesController.import')
  Route.resource('countries', 'address/CountriesController').apiOnly()
  Route.get('states/export', 'address/StatesController.export')
  Route.post('states/import', 'address/StatesController.import')
  Route.resource('states', 'address/StatesController').apiOnly()
  Route.get('cities/export', 'address/CitiesController.export')
  Route.post('cities/import', 'address/CitiesController.import')
  Route.resource('cities', 'address/CitiesController').apiOnly()
  Route.get('streets/export', 'address/StreetsController.export')
  Route.post('streets/import', 'address/StreetsController.import')
  Route.resource('streets', 'address/StreetsController').apiOnly()
}).prefix('api/address')
