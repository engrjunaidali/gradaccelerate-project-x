import { HttpContext } from '@adonisjs/core/http'
import Reminder from '#models/reminder'
import { DateTime } from 'luxon'

export default class HomeController {
  async index({ inertia, auth }: HttpContext) {


    const user = auth.user!
    let upcomingReminders: any[] = []

    if (auth.isAuthenticated) {
      upcomingReminders = await Reminder.query()
        .where('user_id', user.id)  // Filter by user ID
        .where('status', 'pending')
        .where('reminder_datetime', '>=', DateTime.now().toSQL())  // Only future reminders
        .orderBy('reminder_datetime', 'asc')
        .limit(5)
    }

    return inertia.render('home', {
      user: user ? {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      } : null,
      upcomingReminders: upcomingReminders
    })
  }
}
