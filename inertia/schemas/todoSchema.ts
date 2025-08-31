import { z } from 'zod'
import { TodoStatus } from '../../app/enums/TodoStatus.js'
import { TodoPriority } from '../../app/enums/TodoPriority.js'

// Base todo schema for creation
export const todoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be less than 5,000 characters')
    .trim(),
  status: z
    .nativeEnum(TodoStatus, {
      errorMap: () => ({ message: 'Please select a valid status' })
    })
    .default(TodoStatus.PENDING),
  priority: z
    .nativeEnum(TodoPriority, {
      errorMap: () => ({ message: 'Please select a valid priority' })
    })
    .default(TodoPriority.MEDIUM),
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
    ),
  imageUrl: z
    .string()
    .url('Please provide a valid image URL')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val)
})

// Schema for updating todos (all fields optional except those that should remain required)
export const updateTodoSchema = todoSchema.partial({
  status: true,
  priority: true,
  labels: true,
  imageUrl: true
})

// Schema for validating todo ID
export const todoIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .or(z.number().int().positive('ID must be a positive integer'))
    .transform(val => typeof val === 'string' ? parseInt(val, 10) : val)
    .refine(val => !isNaN(val), 'ID must be a valid number')
})

export const TodoImageValidator = z.object({
  extname: z.string().refine(
    (ext) => ['jpg', 'jpeg', 'png', 'webp'].includes(ext.toLowerCase()),
    { message: 'File must be jpg, jpeg, png, or webp' }
  ),
  size: z.number().max(10 * 1024 * 1024, { message: 'File size must be less than 10MB' }),
})

// Type exports
export type TodoFormData = z.infer<typeof todoSchema>
export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>
export type TodoIdFormData = z.infer<typeof todoIdSchema>
export type TodoImageFormData = z.infer<typeof TodoImageValidator>
