import vine from '@vinejs/vine'

export const createReminderValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    description: vine.string().trim().optional(),
    reminderDateTime: vine.string().trim().minLength(1),
    isEmailNotification: vine.boolean().optional(),
    isBrowserNotification: vine.boolean().optional(),
  })
)
