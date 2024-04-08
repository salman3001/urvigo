import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('blogs/unique-field', 'blogs/BlogsController.uniqueField')
  Route.get('blogs/export', 'blogs/BlogsController.export')
  Route.post('blogs/import', 'blogs/BlogsController.import')
  Route.resource('blogs', 'blogs/BlogsController').apiOnly()

  Route.get('blog-categories/unique-field', 'blogs/BlogCategoriesController.uniqueField')
  Route.get('blog-categories/export', 'blogs/BlogCategoriesController.export')
  Route.post('blog-categories/import', 'blogs/BlogCategoriesController.import')
  Route.resource('blog-categories', 'blogs/BlogCategoriesController').apiOnly()
}).prefix('api')
