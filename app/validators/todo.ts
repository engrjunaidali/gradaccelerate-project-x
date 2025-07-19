import vine from '@vinejs/vine'

export const TodoIdValidator = vine.compile(
  vine.object({
    id: vine.number().positive()
  })
)
export const CreateTodoValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1),
    content: vine.string().trim(),
    labels: vine.array(vine.string()).optional(),
    imageUrl: vine.string().url().optional()
  })
)
export const UpdateTodoValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255).optional(),
    content: vine.string().trim().minLength(1).optional(),
    labels: vine.string().optional(),
    imageUrl: vine.string().url().optional().nullable()
  })
)

export const ImageValidator = vine.compile(
  vine.object({
    image: vine.file({
      extnames: ['jpg', 'png', 'webp'],
      size: '10mb',
    })
      .nullable(),
  })
)