import Note from '#models/note'
import { test } from '@japa/runner'
import { afterEach } from 'node:test'

// Group for Note Model Tests
test.group('Note Model Tests', () => {
  let createdNote: Note | null

  // Cleanup after each test
  afterEach(async () => {
    if (createdNote) {
      await createdNote.delete()
      createdNote = null
    }
  })

  test('should create a new note successfully', async ({ expect }) => {
    const note = await Note.create({
      title: 'Test Note',
      content: 'Test Content',
    })
    expect(note.title).toBe('Test Note')
    expect(note.content).toBe('Test Content')
    expect(note.createdAt).toBeDefined()
    expect(note.updatedAt).toBeDefined()
    createdNote = note
  })

  test('should find a note by id', async ({ expect }) => {
    const note = await Note.create({
      title: 'Find Note',
      content: 'Find Content',
    })
    const foundNote = await Note.find(note.id)
    expect(foundNote).not.toBeNull()
    expect(foundNote?.id).toBe(note.id)
    expect(foundNote?.title).toBe('Find Note')
    expect(foundNote?.content).toBe('Find Content')
    createdNote = note
  })

  test('should update note information', async ({ expect }) => {
    const note = await Note.create({
      title: 'Update Note',
      content: 'Update Content',
    })
    await note.merge({ title: 'Updated Title', content: 'Updated Content' }).save()
    const updatedNote = await Note.find(note.id)
    expect(updatedNote?.title).toBe('Updated Title')
    expect(updatedNote?.content).toBe('Updated Content')
    expect(updatedNote?.updatedAt).toBeDefined()
    createdNote = note
  })

  test('should delete a note', async ({ expect }) => {
    const note = await Note.create({
      title: 'Delete Note',
      content: 'Delete Content',
    })
    await note.delete()
    const deletedNote = await Note.find(note.id)
    expect(deletedNote).toBeNull()
  })
})
