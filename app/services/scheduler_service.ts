import cron from 'node-cron'
import ReminderNotificationService from './reminder_notification_service.js'

export default class SchedulerService {
  private static isStarted = false
  private static task: cron.ScheduledTask | null = null

  /**
   * Start all scheduled tasks
   */
  static start() {
    if (this.isStarted) {
      console.log('Scheduler is already running')
      return
    }

    console.log('Starting scheduler service...')

    // Check for due reminders every minute
    this.task = cron.schedule('* * * * *', async () => {
      try {
        console.log('Running scheduled reminder check...')
        const count = await ReminderNotificationService.checkAndSendNotifications()
        if (count > 0) {
          console.log(`Processed ${count} due reminders at ${new Date().toISOString()}`)
        }
      } catch (error) {
        console.error('Error in scheduled reminder check:', error)
      }
    })

    this.isStarted = true
    console.log('Scheduler service started successfully')
  }

  /**
   * Stop all scheduled tasks
   */
  static stop() {
    if (this.task) {
      this.task.stop()
      this.task.destroy()
      this.task = null
    }
    this.isStarted = false
    console.log('Scheduler service stopped')
  }
}
