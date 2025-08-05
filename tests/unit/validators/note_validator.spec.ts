import { test } from '@japa/runner'
import { createNoteValidator, updateNoteValidator } from '#validators/note_validator'
import { errors } from '@vinejs/vine'

test.group('Create Note Validator Tests', () => {
  test('should pass validation with valid data', async ({ expect }) => {
    const validData = {
      title: 'Valid Title',
      content: 'Valid content for the note'
    }

    const result = await createNoteValidator.validate(validData)
    expect(result.title).toBe('Valid Title')
    expect(result.content).toBe('Valid content for the note')
  })

  test('should trim whitespace from title and content', async ({ expect }) => {
    const dataWithWhitespace = {
      title: '  Trimmed Title  ',
      content: '  Trimmed content  '
    }

    const result = await createNoteValidator.validate(dataWithWhitespace)
    expect(result.title).toBe('Trimmed Title')
    expect(result.content).toBe('Trimmed content')
  })

  test('should fail validation when title is missing', async ({ expect }) => {
    const invalidData = {
      content: 'Valid content'
    }

    await expect(createNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should fail validation when content is missing', async ({ expect }) => {
    const invalidData = {
      title: 'Valid Title'
    }

    await expect(createNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should fail validation when title is empty string', async ({ expect }) => {
    const invalidData = {
      title: '',
      content: 'Valid content'
    }

    await expect(createNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should fail validation when content is empty string', async ({ expect }) => {
    const invalidData = {
      title: 'Valid Title',
      content: ''
    }

    await expect(createNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should fail validation when title is only whitespace', async ({ expect }) => {
    const invalidData = {
      title: '   ',
      content: 'Valid content'
    }

    await expect(createNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should fail validation when content is only whitespace', async ({ expect }) => {
    const invalidData = {
      title: 'Valid Title',
      content: '   '
    }

    await expect(createNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should fail validation when title exceeds 255 characters', async ({ expect }) => {
    const longTitle = 'a'.repeat(256)
    const invalidData = {
      title: longTitle,
      content: 'Valid content'
    }

    await expect(createNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should fail validation when content exceeds 5000 characters', async ({ expect }) => {
    const longContent = 'a'.repeat(5001)
    const invalidData = {
      title: 'Valid Title',
      content: longContent
    }

    await expect(createNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should pass validation with maximum allowed lengths', async ({ expect }) => {
    const maxTitle = 'a'.repeat(255)
    const maxContent = 'a'.repeat(5000)
    const validData = {
      title: maxTitle,
      content: maxContent
    }

    const result = await createNoteValidator.validate(validData)
    expect(result.title).toBe(maxTitle)
    expect(result.content).toBe(maxContent)
  })
})

test.group('Update Note Validator Tests', () => {
  test('should pass validation with valid partial data', async ({ expect }) => {
    const validData = {
      title: 'Updated Title'
    }

    const result = await updateNoteValidator.validate(validData)
    expect(result.title).toBe('Updated Title')
    expect(result.content).toBeUndefined()
  })

  test('should pass validation with both title and content', async ({ expect }) => {
    const validData = {
      title: 'Updated Title',
      content: 'Updated content'
    }

    const result = await updateNoteValidator.validate(validData)
    expect(result.title).toBe('Updated Title')
    expect(result.content).toBe('Updated content')
  })

  test('should pass validation with empty object', async ({ expect }) => {
    const validData = {}

    const result = await updateNoteValidator.validate(validData)
    expect(result.title).toBeUndefined()
    expect(result.content).toBeUndefined()
  })

  test('should trim whitespace from optional fields', async ({ expect }) => {
    const dataWithWhitespace = {
      title: '  Updated Title  ',
      content: '  Updated content  '
    }

    const result = await updateNoteValidator.validate(dataWithWhitespace)
    expect(result.title).toBe('Updated Title')
    expect(result.content).toBe('Updated content')
  })

  test('should fail validation when title is empty string', async ({ expect }) => {
    const invalidData = {
      title: ''
    }

    await expect(updateNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should fail validation when content is empty string', async ({ expect }) => {
    const invalidData = {
      content: ''
    }

    await expect(updateNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should fail validation when title is only whitespace', async ({ expect }) => {
    const invalidData = {
      title: '   '
    }

    await expect(updateNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should fail validation when content is only whitespace', async ({ expect }) => {
    const invalidData = {
      content: '   '
    }

    await expect(updateNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should fail validation when title exceeds 255 characters', async ({ expect }) => {
    const longTitle = 'a'.repeat(256)
    const invalidData = {
      title: longTitle
    }

    await expect(updateNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })

  test('should fail validation when content exceeds 5000 characters', async ({ expect }) => {
    const longContent = 'a'.repeat(5001)
    const invalidData = {
      content: longContent
    }

    await expect(updateNoteValidator.validate(invalidData))
      .rejects.toThrow(errors.E_VALIDATION_ERROR)
  })
})
