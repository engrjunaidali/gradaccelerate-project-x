const ReminderStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const

type ReminderStatusType = (typeof ReminderStatus)[keyof typeof ReminderStatus]

export { ReminderStatus }
export type { ReminderStatusType }
