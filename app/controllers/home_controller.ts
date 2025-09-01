import { HttpContext } from '@adonisjs/core/http'
import ReminderNotificationService from '#services/reminder_notification_service'

export default class HomeController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    let upcomingReminders: any[] = []
    let upcomingRemindersCount = 0

    if (auth.isAuthenticated) {
      // Get upcoming reminders (next 24 hours)
      upcomingReminders = await ReminderNotificationService.getUpcomingReminders(user.id)

      // Get count of pending reminders
      upcomingRemindersCount = await ReminderNotificationService.getUpcomingRemindersCount(user.id)
    }

    return inertia.render('home', {
      user: user ? {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      } : null,
      upcomingReminders: upcomingReminders,
      upcomingRemindersCount: upcomingRemindersCount
    })
  }
}
