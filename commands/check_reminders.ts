import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import ReminderNotificationService from '#services/reminder_notification_service'

export default class CheckReminders extends BaseCommand {
  static commandName = 'reminder:check'
  static description = 'Check for due reminders and send notifications'

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: false,
    staysAlive: false,
  }

  async run() {
    this.logger.info('Starting reminder check...')

    try {
      const count = await ReminderNotificationService.checkAndSendNotifications()

      if (count > 0) {
        this.logger.info(`Processed ${count} due reminder(s)`)
      } else {
        this.logger.info('No due reminders found')
      }

      this.logger.success('Reminder check completed successfully')
    } catch (error) {
      this.logger.error('Failed to check reminders:', error)
      this.exitCode = 1
    }
  }
}
