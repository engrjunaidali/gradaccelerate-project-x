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

// Type exports
export type TodoFormData = z.infer<typeof todoSchema>
export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>

// Validation functions
export const validateTodo = (data: unknown) => {
  return todoSchema.safeParse(data)
}

export const validateUpdateTodo = (data: unknown) => {
  return updateTodoSchema.safeParse(data)
}
