import { test } from '@japa/runner'
import { validateNote } from '../../../inertia/schemas/noteSchema.js'

test.group('Simple Invalid Data Cases', () => {
  test('should reject undefined object', async ({ expect }) => {
    const result = validateNote(undefined)
    expect(result.success).toBe(false)
  })

  test('should reject empty object', async ({ expect }) => {
    const result = validateNote({})
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error).toBeDefined()
      expect(result.error.issues.length).toBeGreaterThan(0)
    }
  })

  test('should reject object with empty strings', async ({ expect }) => {
    const emptyData = {
      title: '',
      content: ''
    }

    const result = validateNote(emptyData)
    expect(result.success).toBe(false)
  })
})
