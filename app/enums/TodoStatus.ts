const TodoStatus = {
    PENDING: 'pending',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
} as const

type TodoStatusType = (typeof TodoStatus)[keyof typeof TodoStatus]

export { TodoStatus }
export type { TodoStatusType }
