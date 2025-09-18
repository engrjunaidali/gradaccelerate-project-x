import { test } from '@japa/runner'
import { validateNote, validateUpdateNote } from '../../../inertia/schemas/noteSchema.js'
import { NoteStatus } from '../../../app/enums/NoteStatus.js'

/**
 * Tests for the Zod note schema validation
 *
 * This file tests the note schema defined in inertia/schemas/noteSchema.ts
 * which uses Zod for validation instead of VineJS.
 *
 * Key differences from VineJS tests:
 * - Zod returns { success: boolean, data?: T, error?: ZodError }
 * - We check result.success to see if validation passed
 * - We access validated data via result.data
 * - We access errors via result.error
 */

test.group('Create Note Schema Tests', () => {
  test('should pass validation with valid data', async ({ expect }) => {
    // This is the minimum required data for creating a note
    const validData = {
      title: 'Valid Title',
      content: 'Valid content for the note'
    }

    // validateNote returns { success: true, data: validatedData } if valid
    const result = validateNote(validData)

    // Check that validation was successful
    expect(result.success).toBe(true)

    // Access the validated data
    if (result.success) {
      expect(result.data.title).toBe('Valid Title')
      expect(result.data.content).toBe('Valid content for the note')
      // Default values should be applied
      expect(result.data.status).toBe(NoteStatus.PENDING)
      expect(result.data.pinned).toBe(false)
      expect(result.data.labels).toEqual([])
    }
  })

  test('should trim whitespace from title and content', async ({ expect }) => {
    // Data with extra spaces at the beginning and end
    const dataWithWhitespace = {
      title: '  Trimmed Title  ',
      content: '  Trimmed content  '
    }

    const result = validateNote(dataWithWhitespace)

    expect(result.success).toBe(true)
    if (result.success) {
      // Spaces should be removed (trimmed)
      expect(result.data.title).toBe('Trimmed Title')
      expect(result.data.content).toBe('Trimmed content')
    }
  })

  test('should fail validation when title is missing', async ({ expect }) => {
    // Missing the required 'title' field
    const invalidData = {
      content: 'Valid content'
      // title is missing!
    }

    const result = validateNote(invalidData)

    // Validation should fail
    expect(result.success).toBe(false)

    // Check that we have error details
    if (!result.success) {
      expect(result.error).toBeDefined()
      // The error should mention the title field
      const titleError = result.error.issues.find((issue: any) =>
        issue.path.includes('title')
      )
      expect(titleError).toBeDefined()
    }
  })

  test('should fail validation when content is missing', async ({ expect }) => {
    // Missing the required 'content' field
    const invalidData = {
      title: 'Valid Title'
      // content is missing!
    }

    const result = validateNote(invalidData)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeDefined()
      // The error should mention the content field
      const contentError = result.error.issues.find((issue: any) =>
        issue.path.includes('content')
      )
      expect(contentError).toBeDefined()
    }
  })

  test('should fail validation when title is empty string', async ({ expect }) => {
    const invalidData = {
      title: '', // Empty string is not allowed
      content: 'Valid content'
    }

    const result = validateNote(invalidData)
    expect(result.success).toBe(false)
  })

  test('should fail validation when content is empty string', async ({ expect }) => {
    const invalidData = {
      title: 'Valid Title',
      content: '' // Empty string is not allowed
    }

    const result = validateNote(invalidData)
    expect(result.success).toBe(false)
  })

  test('should fail validation when title exceeds 255 characters', async ({ expect }) => {
    // Create a string that's too long (256 characters)
    const longTitle = 'a'.repeat(256)
    const invalidData = {
      title: longTitle,
      content: 'Valid content'
    }

    const result = validateNote(invalidData)
    expect(result.success).toBe(false)
  })

  test('should fail validation when content exceeds 10000 characters', async ({ expect }) => {
    // Note: Zod schema allows 10,000 characters, not 5,000 like VineJS
    const longContent = 'a'.repeat(10001)
    const invalidData = {
      title: 'Valid Title',
      content: longContent
    }

    const result = validateNote(invalidData)
    expect(result.success).toBe(false)
  })

  test('should pass validation with maximum allowed lengths', async ({ expect }) => {
    // Test the boundaries - exactly at the maximum allowed
    const maxTitle = 'a'.repeat(255)
    const maxContent = 'a'.repeat(10000) // Zod allows 10,000 characters
    const validData = {
      title: maxTitle,
      content: maxContent
    }

    const result = validateNote(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe(maxTitle)
      expect(result.data.content).toBe(maxContent)
    }
  })

  test('should accept valid status from enum', async ({ expect }) => {
    const validData = {
      title: 'Valid Title',
      content: 'Valid content',
      status: NoteStatus.COMPLETED // Using a valid enum value
    }

    const result = validateNote(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe(NoteStatus.COMPLETED)
    }
  })

  test('should accept valid labels array', async ({ expect }) => {
    const validData = {
      title: 'Valid Title',
      content: 'Valid content',
      labels: ['important', 'work', 'todo']
    }

    const result = validateNote(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.labels).toEqual(['important', 'work', 'todo'])
    }
  })

  test('should fail validation with duplicate labels', async ({ expect }) => {
    const invalidData = {
      title: 'Valid Title',
      content: 'Valid content',
      labels: ['important', 'work', 'important'] // 'important' appears twice
    }

    const result = validateNote(invalidData)
    expect(result.success).toBe(false)
  })

  test('should fail validation with too many labels', async ({ expect }) => {
    // Create an array with 11 labels (max is 10)
    const tooManyLabels = Array.from({ length: 11 }, (_, i) => `label${i}`)
    const invalidData = {
      title: 'Valid Title',
      content: 'Valid content',
      labels: tooManyLabels
    }

    const result = validateNote(invalidData)
    expect(result.success).toBe(false)
  })
})

test.group('Update Note Schema Tests', () => {

  test('should pass validation with both title and content', async ({ expect }) => {
    const validData = {
      title: 'Updated Title',
      content: 'Updated content'
    }

    const result = validateUpdateNote(validData)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('Updated Title')
      expect(result.data.content).toBe('Updated content')
    }
  })

  test('should trim whitespace from optional fields', async ({ expect }) => {
    const dataWithWhitespace = {
      title: '  Updated Title  ',
      content: '  Updated content  '
    }

    const result = validateUpdateNote(dataWithWhitespace)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('Updated Title')
      expect(result.data.content).toBe('Updated content')
    }
  })

  test('should fail validation when title is empty string', async ({ expect }) => {
    // Even for updates, if you provide title, it can't be empty
    const invalidData = {
      title: ''
    }

    const result = validateUpdateNote(invalidData)
    expect(result.success).toBe(false)
  })

  test('should fail validation when content is empty string', async ({ expect }) => {
    // Even for updates, if you provide content, it can't be empty
    const invalidData = {
      content: ''
    }

    const result = validateUpdateNote(invalidData)
    expect(result.success).toBe(false)
  })

  test('should fail validation when title is only whitespace', async ({ expect }) => {
    const invalidData = {
      title: '   ' // Will be trimmed to empty string
    }

    const result = validateUpdateNote(invalidData)
    expect(result.success).toBe(false)
  })

  test('should fail validation when content is only whitespace', async ({ expect }) => {
    const invalidData = {
      content: '   ' // Will be trimmed to empty string
    }

    const result = validateUpdateNote(invalidData)
    expect(result.success).toBe(false)
  })

  test('should fail validation when title exceeds 255 characters', async ({ expect }) => {
    const longTitle = 'a'.repeat(256)
    const invalidData = {
      title: longTitle
    }

    const result = validateUpdateNote(invalidData)
    expect(result.success).toBe(false)
  })

  test('should fail validation when content exceeds 10000 characters', async ({ expect }) => {
    const longContent = 'a'.repeat(10001)
    const invalidData = {
      content: longContent
    }

    const result = validateUpdateNote(invalidData)
    expect(result.success).toBe(false)
  })
})

test.group('Edge Cases for Note Schema', () => {
  test('should reject undefined object', async ({ expect }) => {
    // undefined is not valid input
    const result = validateNote(undefined)
    expect(result.success).toBe(false)
  })

  test('should reject null object', async ({ expect }) => {
    // null is not valid input
    const result = validateNote(null)
    expect(result.success).toBe(false)
  })

  test('should reject empty object', async ({ expect }) => {
    // Empty object is missing required fields
    const result = validateNote({})
    expect(result.success).toBe(false)
  })

  test('should reject object with empty strings', async ({ expect }) => {
    // Empty strings are not allowed
    const emptyData = {
      title: '',
      content: ''
    }
    const result = validateNote(emptyData)
    expect(result.success).toBe(false)
  })

  test('should reject non-object input', async ({ expect }) => {
    // String input instead of object
    const result = validateNote('not an object')
    expect(result.success).toBe(false)
  })

  test('should reject number input', async ({ expect }) => {
    // Number input instead of object
    const result = validateNote(123)
    expect(result.success).toBe(false)
  })

  test('should reject array input', async ({ expect }) => {
    // Array input instead of object
    const result = validateNote(['title', 'content'])
    expect(result.success).toBe(false)
  })
})
