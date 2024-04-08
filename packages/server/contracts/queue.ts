import { TestNotification } from 'App/Notifications/TestNotification'

declare module '@ioc:Rlanz/Queue' {
  interface JobsList {
    'App/Jobs/SendNotificaions': TestNotification
  }
}
