import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    const Response = this.app.container.use('Adonis/Core/Response')

    Response.macro(
      'custom',
      function (opt: {
        code: number
        data: null | Record<any, any>
        message: string
        success: boolean
        error?: string
      }) {
        const errorObject = opt.error ? { error: opt.error } : {}
        this.status(opt.code).send({
          message: opt.message,
          data: opt.data,
          success: opt.success,
          ...errorObject,
        })
        return this
      }
    )
  }

  public async ready() {
    // App is ready
    if (this.app.environment === 'web') {
      await import('../start/socket')
      await import('App/services/PaymentGateway')
    }
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
