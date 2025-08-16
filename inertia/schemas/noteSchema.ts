import { z } from 'zod'
import { NoteStatus } from '../../app/enums/NoteStatus.js'

// Base note schema for creation
export const noteSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(10000, 'Content must be less than 10,000 characters')
    .trim(),
  status: z
    .nativeEnum(NoteStatus, {
      errorMap: () => ({ message: 'Please select a valid status' })
    })
    .default(NoteStatus.PENDING),
  pinned: z
    .boolean()
    .default(false),
  labels: z
    .array(z.string().trim().min(1, 'Label cannot be empty'))
    .max(10, 'Maximum 10 labels allowed')
    .default([])
    .refine(
      (labels) => {
        const uniqueLabels = new Set(labels)
        return uniqueLabels.size === labels.length
      },
      {
        message: 'Duplicate labels are not allowed'
      }
    )
})

// Schema for updating notes (all fields optional except those that should remain required)
export const updateNoteSchema = noteSchema.partial({
  status: true,
  // pinned: true,
  labels: true
})

// Type exports
export type NoteFormData = z.infer<typeof noteSchema>
export type UpdateNoteFormData = z.infer<typeof updateNoteSchema>

// Validation helper functions
export const validateNote = (data: unknown) => {
  return noteSchema.safeParse(data)
}

export const validateUpdateNote = (data: unknown) => {
  return updateNoteSchema.safeParse(data)
}
