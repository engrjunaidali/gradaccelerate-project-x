const TodoPriority = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
} as const

type TodoPriorityType = (typeof TodoPriority)[keyof typeof TodoPriority]

export { TodoPriority }
export type { TodoPriorityType }
