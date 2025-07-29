import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new note.
 */
export const createNoteValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    content: vine.string().trim().minLength(1).maxLength(5000),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing note.
 */
export const updateNoteValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255).optional(),
    content: vine.string().trim().minLength(1).maxLength(5000).optional(),
  })
)
