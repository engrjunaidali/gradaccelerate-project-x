import { z } from 'zod'

// Base bookmark schema for creation
export const bookmarkSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  url: z
    .string({ required_error: 'URL is required' })
    .min(1, 'URL is required')
    .max(2048, 'URL must be less than 2048 characters')
    .url('Please enter a valid URL')
    .trim(),
  isFavorite: z
    .boolean()
    .default(false)
})

// Schema for updating bookmarks (all fields optional except those that should remain required)
export const updateBookmarkSchema = bookmarkSchema.partial({
  isFavorite: true
})

// Type exports
export type BookmarkFormData = z.infer<typeof bookmarkSchema>
export type UpdateBookmarkFormData = z.infer<typeof updateBookmarkSchema>

// Validation helper functions
export const validateBookmark = (data: unknown) => {
  return bookmarkSchema.safeParse(data)
}

export const validateUpdateBookmark = (data: unknown) => {
  return updateBookmarkSchema.safeParse(data)
}
