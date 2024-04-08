declare module '@ioc:Adonis/Core/Response' {
  interface ResponseContract {
    custom(opt: {
      code: number
      data: null | Record<any, any>
      message: string | null
      success: boolean
      error?: string
    }): this
  }
}
