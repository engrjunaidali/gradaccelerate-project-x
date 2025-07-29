import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'
import { createNoteValidator, updateNoteValidator } from '#validators/note_validator'

export default class NotesController {
  /**
   * Display a list of notes
   */
  async index({ inertia }: HttpContext) {
    const notes = await Note.all()
    return inertia.render('notes/index', { notes })
  }

  /**
   * Get a specific note
   */
  async show({ params, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }
    return response.json(note)
  }

  /**
   * Store a new note
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createNoteValidator)
    const note = await Note.create(data)
    return response.redirect().back()
  }

  /**
   * Update a note
   */
  async update({ params, request, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    const data = await request.validateUsing(updateNoteValidator)
    await note.merge(data).save()
    return response.redirect().back()
  }

  /**
   * Delete a note
   */
  async destroy({ params, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    await note.delete()
    return response.redirect().back()
  }
}