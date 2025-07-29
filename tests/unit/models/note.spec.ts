import Note from '#models/note'
import { test } from '@japa/runner'
import { afterEach } from 'node:test'
import { mockDb } from '../../helpers/database_mock.js'

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
    const note = await mockDb.create({ title: 'Mock Title', content: 'Mock Content' })
    expect(note.title).toBe('Mock Title')
    expect(note.content).toBe('Mock Content')
    expect(note.createdAt).toBeDefined()
    expect(note.updatedAt).toBeDefined()
    createdNote = note
  })

  test('should find a note by id', async ({ expect }) => {
  const note = await mockDb.create({ title: 'Mock Title', content: 'Mock Content' })

  const foundNote = await mockDb.find(note.id)
  expect(foundNote).not.toBeNull()
  expect(foundNote?.id).toBe(note.id)
  expect(foundNote?.title).toBe('Mock Title')
  expect(foundNote?.content).toBe('Mock Content')

  createdNote = note  // if you want to track created notes for cleanup
})

  test('should update note information', async ({ expect }) => {
    const note = await mockDb.create({
      title: 'Update Note',
      content: 'Update Content',
    })
    await mockDb.update(note.id, { title: 'Updated Title', content: 'Updated Content' })
    const updatedNote = await mockDb.find(note.id)
    expect(updatedNote?.title).toBe('Updated Title')
    expect(updatedNote?.content).toBe('Updated Content')
    expect(updatedNote?.updatedAt).toBeDefined()
    createdNote = note
  })

  test('should delete a note', async ({ expect }) => {
    const note = await mockDb.create({
      title: 'Delete Note',
      content: 'Delete Content',
    })
    await mockDb.delete(note.id)
    const deletedNote = await mockDb.find(note.id)
    expect(deletedNote).toBeNull()
  })
})
