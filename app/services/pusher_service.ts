import Pusher from 'pusher'
import pusherConfig from '#config/pusher'
import type User from '#models/user'
import type Reminder from '#models/reminder'

export default class PusherService {
  private static pusher: Pusher

  private static getPusher() {
    if (!this.pusher) {
      this.pusher = new Pusher({
        appId: pusherConfig.appId!,
        key: pusherConfig.key!,
        secret: pusherConfig.secret!,
        cluster: pusherConfig.cluster!,
        useTLS: true,
      })
    }
    return this.pusher
  }

  /**
   * Send a reminder notification to a specific user
   */
  static async sendReminderNotification(user: User, reminder: Reminder) {
    const pusher = this.getPusher()

    try {
      const channelName = `user-${user.id}-reminders`
      const eventName = 'reminder-due'

      const data = {
        id: reminder.id,
        title: reminder.title,
        description: reminder.description,
        reminderDateTime: reminder.reminderDateTime.toISO(),
        message: `Reminder: ${reminder.title}`,
        timestamp: new Date().toISOString(),
      }

      await pusher.trigger(channelName, eventName, data)

      console.log(`Sent reminder notification for user ${user.id}, reminder ${reminder.id}`)
      return true
    } catch (error) {
      console.error('Failed to send reminder notification:', error)
      return false
    }
  }

  /**
   * Send a test notification to a user
   */
  static async sendTestNotification(userId: number, message: string) {
    const pusher = this.getPusher()

    try {
      const channelName = `user-${userId}-reminders`
      const eventName = 'test-notification'

      const data = {
        message,
        timestamp: new Date().toISOString(),
      }

      await pusher.trigger(channelName, eventName, data)

      console.log(`Sent test notification to user ${userId}`)
      return true
    } catch (error) {
      console.error('Failed to send test notification:', error)
      return false
    }
  }
}
