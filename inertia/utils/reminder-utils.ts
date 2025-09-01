import { format } from 'date-fns'

/**
 * Format reminder date time in a user-friendly way
 * Shows "Today at 2:30 PM" for today's reminders, otherwise shows full date
 */
export const formatReminderDateTime = (dateTime: string): string => {
  const date = new Date(dateTime)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return `Today at ${format(date, 'h:mm a')}`
  }
  return format(date, 'MMM dd, yyyy HH:mm')
}

/**
 * Check if a reminder is overdue
 */
export const isReminderOverdue = (dateTime: string, status: string): boolean => {
  if (status === 'completed' || status === 'cancelled') return false
  return new Date(dateTime) < new Date()
}
