import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('conversations/:id/create-message', 'chat/ConversationsController.createMessage')
  Route.post('conversations/:id/mark-all-as-read', 'chat/ConversationsController.markAllAsRead')
  Route.get(
    'conversations/:id/get-messages',
    'chat/ConversationsController.getConversationMessages'
  )
  Route.resource('conversations', 'chat/ConversationsController').only(['index', 'show', 'store'])
}).prefix('api/chat')
