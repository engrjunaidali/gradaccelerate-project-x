import { test } from '@japa/runner'
import { createNoteValidator, updateNoteValidator } from '#validators/note_validator'
import { errors } from '@vinejs/vine'

test.group('Simple Invalid Data Cases', () => {
  test('should reject undefined object', async ({ expect }) => {
    await expect(createNoteValidator.validate(undefined))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should reject empty object', async ({ expect }) => {
    await expect(createNoteValidator.validate({}))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should reject object with only spaces', async ({ expect }) => {
    const spacesData = {
      title: '    ',
      content: '    '
    }
    await expect(createNoteValidator.validate(spacesData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should reject object with empty strings', async ({ expect }) => {
    const emptyData = {
      title: '',
      content: ''
    }
    await expect(createNoteValidator.validate(emptyData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })
})
