import { HttpContext } from '@adonisjs/core/http'
import Reminder from '#models/reminder'
import { asyncHandler } from '../utils/asyncHandler.js'
import { DateTime } from 'luxon'
import { ReminderStatus } from '../enums/ReminderStatus.js'
import { reminderSchema, type UpdateReminderFormData } from '../../inertia/schemas/reminderSchema.js'
export default class RemindersController {
  /**
   * Display a list of reminders
   */
  index = asyncHandler(async ({ inertia, request, auth }: HttpContext) => {
    const page = request.input('page', 1)
    const perPage = 12
    const sortField = request.input('sort', 'reminder_datetime')
    const sortDirection = request.input('direction', 'asc')
    const searchQuery = request.input('search', '')
    const filterStatus = request.input('status', 'all')

    // Validate sort field
    const allowedSortFields = ['created_at', 'updated_at', 'title', 'reminder_datetime']
    const validSortField = allowedSortFields.includes(sortField) ? sortField : 'reminder_datetime'
    const validSortDirection = ['asc', 'desc'].includes(sortDirection) ? sortDirection : 'asc'

    const user = auth.user!

    let query = Reminder.query()
      .where('user_id', user.id)
      .orderBy(validSortField, validSortDirection)

    if (searchQuery) {
      query = query.where((builder) => {
        builder
          .whereILike('title', `%${searchQuery}%`)
          .orWhereILike('description', `%${searchQuery}%`)
      })
    }

    if (filterStatus && filterStatus !== 'all') {
      query = query.where('status', filterStatus)
    }

    const reminders = await query.paginate(page, perPage)

    return inertia.render('reminders/index', {
      csrfToken: request.csrfToken,
      reminders: {
        data: reminders.toJSON().data,
        meta: {
          current_page: reminders.currentPage,
          last_page: reminders.lastPage,
          per_page: reminders.perPage,
          total: reminders.total,
          from: (reminders.currentPage - 1) * reminders.perPage + 1,
          to: (reminders.currentPage - 1) * reminders.perPage + reminders.toJSON().data.length,
        },
        currentSort: {
          field: validSortField,
          direction: validSortDirection,
        },
      },
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      currentStatus: filterStatus,
    })
  })

  /**
   * Get a specific reminder
   */
  show = asyncHandler(async ({ params, response, auth }: HttpContext) => {
    const user = auth.user!
    const reminder = await Reminder.query().where('id', params.id).where('user_id', user.id).first()

    if (!reminder) {
      return response.notFound({ message: 'Reminder not found' })
    }
    return response.json(reminder)
  })

  /**
   * Store a new reminder
   */
  store = asyncHandler(async ({ request, response, auth }: HttpContext) => {
    const result = reminderSchema.safeParse(request.all())

    if (!result.success) {
      return response.badRequest({
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors
      })
    }

    const payload = result.data
    const user = auth.user!

    // Parse the reminder date time
    const reminderDateTime = DateTime.fromISO(payload.reminderDateTime)

    if (!reminderDateTime.isValid) {
      return response.badRequest({
        message: 'Invalid reminder date and time',
        errors: { reminderDateTime: 'Please provide a valid date and time' }
      })
    }

    await Reminder.create({
      title: payload.title,
      description: payload.description || null,
      reminderDateTime,
      isEmailNotification: payload.isEmailNotification ?? false,
      isBrowserNotification: payload.isBrowserNotification ?? true,
      status: ReminderStatus.PENDING,
      userId: user.id,
    })

    return response.redirect().back()
  })

  /**
   * Update a reminder
   */
  update = asyncHandler(async ({ params, request, response, auth }: HttpContext) => {
    const user = auth.user!
    const reminder = await Reminder.query().where('id', params.id).where('user_id', user.id).first()

    if (!reminder) {
      return response.notFound({ message: 'Reminder not found' })
    }

    const data = request.only(['title', 'description', 'reminderDateTime', 'isEmailNotification', 'isBrowserNotification'])

    // Parse the reminder date time if provided
    let reminderDateTime = reminder.reminderDateTime
    if (data.reminderDateTime) {
      const parsedDateTime = DateTime.fromISO(data.reminderDateTime)
      if (!parsedDateTime.isValid) {
        return response.badRequest({ message: 'Invalid reminder date and time' })
      }
      reminderDateTime = parsedDateTime
    }

    const updateData = {
      title: data.title || reminder.title,
      description: data.description !== undefined ? data.description : reminder.description,
      reminderDateTime,
      isEmailNotification: data.isEmailNotification !== undefined ? data.isEmailNotification : reminder.isEmailNotification,
      isBrowserNotification: data.isBrowserNotification !== undefined ? data.isBrowserNotification : reminder.isBrowserNotification,
    }

    await reminder.merge(updateData).save()

    return response.redirect().back()
  })

  /**
   * Mark reminder as complete
   */
  markComplete = asyncHandler(async ({ params, response, session, auth }: HttpContext) => {
    const user = auth.user!
    const reminder = await Reminder.query().where('id', params.id).where('user_id', user.id).first()

    if (!reminder) {
      session.flash('error', 'Reminder not found')
      return response.redirect().back()
    }

    // Toggle between pending and completed status
    reminder.status = reminder.status === ReminderStatus.COMPLETED ? ReminderStatus.PENDING : ReminderStatus.COMPLETED
    await reminder.save()

    const message = reminder.status === ReminderStatus.COMPLETED ? 'Reminder marked as completed' : 'Reminder marked as pending'
    session.flash('success', message)

    return response.redirect().back()
  })

  /**
   * Delete a reminder
   */
  destroy = asyncHandler(async ({ params, response, auth }: HttpContext) => {
    const user = auth.user!
    const reminder = await Reminder.query().where('id', params.id).where('user_id', user.id).first()

    if (!reminder) {
      return response.notFound({ message: 'Reminder not found' })
    }

    await reminder.delete()
    return response.redirect().back()
  })


}
