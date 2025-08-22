import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new bookmark.
 */
export const createBookmarkValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    url: vine.string().trim().minLength(1).maxLength(2048).url(),
    isFavorite: vine.boolean().optional(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing bookmark.
 */
export const updateBookmarkValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255).optional(),
    url: vine.string().trim().minLength(1).maxLength(2048).url().optional(),
    isFavorite: vine.boolean().optional(),
  })
)