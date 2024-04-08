import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/admin-users/unique-field', 'adminUser/AdminUsersController.uniqueField')
  Route.post('admin-users/change-role/:id', 'adminUser/AdminUsersController.changeRole')
  Route.post('admin-users/ban/:id', 'adminUser/AdminUsersController.banUser')
  Route.get('admin-users/activities', 'adminUser/ActivitiesController.index')
  Route.get('admin-users/export', 'adminUser/AdminUsersController.export')
  Route.post('admin-users/import', 'adminUser/AdminUsersController.import')
  Route.post('admin-users/update-password/:id', 'adminUser/AdminUsersController.updateUserPassword')
  Route.put('admin-users/:id/update-profile', 'adminUser/AdminUsersController.updateProfile')
  Route.resource('admin-users', 'adminUser/AdminUsersController').apiOnly()
  Route.get('roles/export', 'adminUser/RolesController.export')
  Route.post('roles/import', 'adminUser/RolesController.import')
  Route.resource('roles', 'adminUser/RolesController').apiOnly()
  Route.get('all-permissions', 'adminUser/RolesController.allPermissions')
}).prefix('api')
