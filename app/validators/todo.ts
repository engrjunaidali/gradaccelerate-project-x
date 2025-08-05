import { z } from 'zod'

export const TodoIdValidator = z.object({
  id: z.number().positive()
})

export const CreateTodoValidator = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim(),
  labels: z.string().optional(),
  imageUrl: z.string().url().optional()
})

export const UpdateTodoValidator = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  content: z.string().trim().min(1).optional(),
  labels: z.string().optional(),
  imageUrl: z.string().url().optional().nullable()
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