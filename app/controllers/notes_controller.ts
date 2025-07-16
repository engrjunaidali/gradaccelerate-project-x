import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'

export default class NotesController {
  /**
   * Display a list of notes
   */
   async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = 6
    
    const notes = await Note.query()
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)

    return inertia.render('notes/index', { 
      notes: {
        data: notes.toJSON().data,
        meta: {
          current_page: notes.currentPage,
          last_page: notes.lastPage,
          per_page: notes.perPage,
          total: notes.total,
          from: (notes.currentPage - 1) * notes.perPage + 1,
          to: (notes.currentPage - 1) * notes.perPage + notes.toJSON().data.length
        }
      }
    })
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
    const data = request.only(['title', 'content', 'status'])
    const note = await Note.create({
      ...data,
      status: data.status || 'pending'
    })
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

    const data = request.only(['title', 'content', 'status'])
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