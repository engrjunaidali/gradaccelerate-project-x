const NoteStatus = {
    PENDING: 'pending',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
} as const

type NoteStatusType = (typeof NoteStatus)[keyof typeof NoteStatus]

export { NoteStatus }
export type { NoteStatusType }
