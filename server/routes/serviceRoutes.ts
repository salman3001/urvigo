import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // services
  Route.delete('service/delete-screenshot/:id', 'service/ServiceController.deleteScreenShot')
  Route.get('service/export', 'service/ServiceController.export')
  Route.post('service/import', 'service/ServiceController.import')
  Route.get('service/by-slug/:slug', 'service/ServiceController.showBySlug')
  Route.get('service/my-list', 'service/ServiceController.myList')
  Route.resource('service', 'service/ServiceController').apiOnly()

  // service variants
  Route.resource('service-variants', 'service/ServiceVariantController').apiOnly()

  // service categories
  Route.get('service-category/export', 'service/ServiceCategoriesController.export')
  Route.post('service-category/import', 'service/ServiceCategoriesController.import')
  Route.get('service-category/by-slug/:slug', 'service/ServiceCategoriesController.showBySlug')
  Route.resource('service-category', 'service/ServiceCategoriesController').apiOnly()

  // service sub categories
  Route.get('service-subcategory/export', 'service/ServiceSubcategoriesController.export')
  Route.post('service-subcategory/import', 'service/ServiceSubcategoriesController.import')
  Route.get(
    'service-subcategory/by-slug/:slug',
    'service/ServiceSubcategoriesController.showBySlug'
  )

  Route.resource('service-subcategory', 'service/ServiceSubcategoriesController').apiOnly()

  // service tags
  Route.get('service-tags/export', 'service/ServiceTagsController.export')
  Route.post('service-tags/import', 'service/ServiceTagsController.import')
  Route.get('service-tags/by-slug/:slug', 'service/ServiceTagsController.showBySlug')
  Route.resource('service-tags', 'service/ServiceTagsController').apiOnly()

  // reviews
  Route.resource('/service/:serviceId/reviews', 'service/ReviewsController').only([
    'store',
    'index',
  ])
}).prefix('api')
