import { z } from 'zod'
import { TodoPriority } from '../enums/TodoPriority.js'
import { TodoStatus } from '../enums/TodoStatus.js'

export const TodoIdValidator = z.object({
  id: z.number().int().positive()
})

export const CreateTodoValidator = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum([TodoStatus.PENDING, TodoStatus.IN_PROGRESS, TodoStatus.COMPLETED]),
  labels: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().nullable(),
  priority: z.enum([TodoPriority.HIGH, TodoPriority.MEDIUM, TodoPriority.LOW])
})

export const UpdateTodoValidator = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  status: z.enum([TodoStatus.PENDING, TodoStatus.IN_PROGRESS, TodoStatus.COMPLETED]),
  labels: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().nullable(),
  priority: z.enum([TodoPriority.HIGH, TodoPriority.MEDIUM, TodoPriority.LOW])
})

export const ImageValidator = z.object({
  extname: z.string().refine(
    (ext) => ['jpg', 'jpeg', 'png', 'webp'].includes(ext.toLowerCase()),
    { message: 'File must be jpg, jpeg, png, or webp' }
  ),
  size: z.number().max(10 * 1024 * 1024, { message: 'File size must be less than 10MB' }),
})

export type TodoIdInput = z.infer<typeof TodoIdValidator>
export type CreateTodoInput = z.infer<typeof CreateTodoValidator>
export type UpdateTodoInput = z.infer<typeof UpdateTodoValidator>
export type ImageInput = z.infer<typeof ImageValidator>
