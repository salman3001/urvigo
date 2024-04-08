import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('content/export', 'helpcenter/KnowledgeBaseContentsController.export')
  Route.post('content/import', 'helpcenter/KnowledgeBaseContentsController.import')
  Route.get('content/unique-field', 'helpcenter/KnowledgeBaseContentsController.uniqueField')
  Route.resource('content', 'helpcenter/KnowledgeBaseContentsController').apiOnly()

  Route.get('categories/export', 'helpcenter/KnowledgeBaseCategoriesController.export')
  Route.post('categories/import', 'helpcenter/KnowledgeBaseCategoriesController.import')
  Route.get('categories/unique-field', 'helpcenter/KnowledgeBaseCategoriesController.uniqueField')
  Route.resource('categories', 'helpcenter/KnowledgeBaseCategoriesController').apiOnly()

  Route.get('contact-message/export', 'helpcenter/ContactMessagesController.export')
  Route.post('contact-message/import', 'helpcenter/ContactMessagesController.import')
  Route.resource('contact-message', 'helpcenter/ContactMessagesController').apiOnly()

  Route.post('support-ticket/change-status/:id', 'helpcenter/SupportTicketsController.changeStatus')
  Route.get('support-ticket/messages/:id', 'helpcenter/SupportTicketsController.ticketMessages')
  Route.post(
    'support-ticket/create-message/:id',
    'helpcenter/SupportTicketsController.createMessage'
  )
  Route.resource('support-ticket', 'helpcenter/SupportTicketsController').apiOnly()
}).prefix('api/help-center')
