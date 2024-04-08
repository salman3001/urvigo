import type { JobHandlerContract, Job } from '@ioc:Rlanz/Queue'
import { TestNotification } from 'App/Notifications/TestNotification'
export default class implements JobHandlerContract {
  constructor(public job: Job) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  public async handle(testNotification: TestNotification) {
    for (const user of testNotification.users) {
      testNotification.create(user)
    }
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async failed() {}
}
