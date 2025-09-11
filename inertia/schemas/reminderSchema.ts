import { z } from 'zod'

// Base reminder schema for creation
export const reminderSchema = z.object({
  title: z
    .string({ message: 'Title is required' })
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .nullable()
    .or(z.literal('')),
  reminderDateTime: z
    .string({ message: 'Reminder date and time is required' })
    .min(1, 'Reminder date and time is required'),
  isEmailNotification: z
    .boolean()
    .default(false),
  isBrowserNotification: z
    .boolean()
    .default(true)
})

// Schema for updating reminders (all fields optional except those that should remain required)
export const updateReminderSchema = reminderSchema.partial({
  reminderDateTime: true
})

// Type exports
export type ReminderFormData = z.infer<typeof reminderSchema>
export type UpdateReminderFormData = z.infer<typeof updateReminderSchema>

// Validation helper functions
export const validateReminder = (data: unknown) => {
  return reminderSchema.safeParse(data)
}

export const validateUpdateReminder = (data: unknown) => {
  return updateReminderSchema.safeParse(data)
}
