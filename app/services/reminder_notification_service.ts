import { DateTime } from 'luxon'
import Reminder from '#models/reminder'
import PusherService from './pusher_service.js'
import { ReminderStatus } from '../enums/ReminderStatus.js'

export default class ReminderNotificationService {
  /**
   * Check for due reminders and send notifications
   */
  static async checkAndSendNotifications() {
    try {
      console.log('Checking for due reminders...')

      const now = DateTime.now()

      // Find reminders that are due (within the last 1 minute and next 1 minute)
      // This gives us a 2-minute window to catch reminders
      const dueReminders = await Reminder.query()
        .where('status', ReminderStatus.PENDING)
        .where('reminder_datetime', '<=', now.plus({ minutes: 1 }).toSQL())
        .where('reminder_datetime', '>=', now.minus({ minutes: 1 }).toSQL())
        .preload('user')

      console.log(`Found ${dueReminders.length} due reminders`)

      for (const reminder of dueReminders) {
        await this.processReminderNotification(reminder)
      }

      return dueReminders.length
    } catch (error) {
      console.error('Error checking due reminders:', error)
      throw error
    }
  }

  /**
   * Process a single reminder notification
   */
  private static async processReminderNotification(reminder: Reminder) {
    try {
      const user = reminder.user

      // Send browser notification if enabled
      if (reminder.isBrowserNotification) {
        await PusherService.sendReminderNotification(user, reminder)
      }

      // Send email notification if enabled (you can implement this later)
      if (reminder.isEmailNotification) {
        // TODO: Implement email notification
        console.log(`Email notification needed for reminder ${reminder.id}`)
      }

      // Optional: Mark reminder as completed or create a "notified" status
      // For now, we'll keep it as pending so users can manually mark it complete

      console.log(`Processed notification for reminder ${reminder.id} - ${reminder.title}`)

    } catch (error) {
      console.error(`Error processing reminder notification ${reminder.id}:`, error)
    }
  }

  /**
   * Get upcoming reminders for a user (next 24 hours)
   */
  static async getUpcomingReminders(userId: number) {
    const now = DateTime.now()
    const tomorrow = now.plus({ days: 1 })

    return await Reminder.query()
      .where('user_id', userId)
      .where('status', ReminderStatus.PENDING)
      .where('reminder_datetime', '>=', now.toSQL())
      .where('reminder_datetime', '<=', tomorrow.toSQL())
      .orderBy('reminder_datetime', 'asc')
  }



  /**
   * Get count of pending reminders for a user
   */
  static async getUpcomingRemindersCount(userId: number) {
    const now = DateTime.now()
    const tomorrow = now.plus({ days: 1 })
    const reminders = await Reminder.query()
      .where('user_id', userId)
      .where('status', ReminderStatus.PENDING)
      .where('reminder_datetime', '>=', now.toSQL())
      .where('reminder_datetime', '<=', tomorrow.toSQL())
      .orderBy('reminder_datetime', 'asc')

    return reminders.length
  }

  /**
   * Send a test notification to a user
   */
  static async sendTestNotification(userId: number) {
    try {
      await PusherService.sendTestNotification(userId, 'This is a test notification from the reminder system!')
      return true
    } catch (error) {
      console.error('Failed to send test notification:', error)
      return false
    }
  }
}
