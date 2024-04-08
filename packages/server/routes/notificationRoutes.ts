import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/notifications/get-menu-notifications', 'NotificationsController.getMenuNotifications')
  Route.post('/notifications/mark-as-read/:id', 'NotificationsController.markAsRead')
  Route.delete('/notifications/delete/read', 'NotificationsController.destroyRead')
  Route.delete('/notifications/delete/all', 'NotificationsController.destroyAll')
  Route.resource('/notifications', 'NotificationsController').only(['index', 'update', 'destroy'])
}).prefix('api')
