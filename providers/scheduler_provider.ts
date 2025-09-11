import { ApplicationService } from '@adonisjs/core/types'
import SchedulerService from '#services/scheduler_service'

export default class SchedulerProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {
    // Start the scheduler only in production or when explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_SCHEDULER === 'true') {
      SchedulerService.start()
    }
  }

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    SchedulerService.stop()
  }
}
