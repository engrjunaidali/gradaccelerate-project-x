import type { HttpContext } from '@adonisjs/core/http'

export default class ErrorTestController {
  
  async index({ inertia }: HttpContext) {
    return inertia.render('error-test', {
      title: 'Error Testing Page'
    })
  }
}
