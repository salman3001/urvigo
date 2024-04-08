/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    /**
     * Self handle the validation exception
     */
    // if (error.code === 'E_VALIDATION_FAILURE') {
    //   return ctx.response.status(422).send(error.messages)
    // }

    if (ctx.response.getStatus() === 422) {
      return ctx.response.status(ctx.response.getStatus()).send({
        success: false,
        message: 'Not all the fields are filled correctly',
        data: null,
        errors: error.messages.errors,
      })
    }

    if (ctx.response.getStatus() === 500) {
      return ctx.response
        .status(ctx.response.getStatus())
        .send({ success: false, message: 'Server Error', data: null, error: error.message })
    }

    if (ctx.response.getStatus() === 400) {
      return ctx.response
        .status(ctx.response.getStatus())
        .send({ success: false, message: 'Bad Request', data: null, error: error.message })
    }

    if (ctx.response.getStatus() === 403) {
      return ctx.response
        .status(ctx.response.getStatus())
        .send({ success: false, message: 'Authorization failed', data: null, error: error.message })
    }

    if (ctx.response.getStatus() === 404) {
      return ctx.response
        .status(ctx.response.getStatus())
        .send({ success: false, message: 'Not Found', data: null, error: error.message })
    }
    /**
     * Forward rest of the exceptions to the parent class
     */
    return super.handle(error, ctx)
  }
}
