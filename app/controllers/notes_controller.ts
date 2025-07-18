import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'
import { NoteStatus } from '../enums/NoteStatus.js'


export default class NotesController {
  /**
   * Display a list of notes
   */
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = 6
    const sortField = request.input('sort', 'created_at')
    const sortDirection = request.input('direction', 'desc')

    // Validate sort field
    const allowedSortFields = ['created_at', 'updated_at', 'title']
    const validSortField = allowedSortFields.includes(sortField) ? sortField : 'created_at'
    const validSortDirection = ['asc', 'desc'].includes(sortDirection) ? sortDirection : 'desc'

    let query = Note.query()
      .orderBy('pinned', 'desc')
      .orderBy(validSortField, validSortDirection)

    if (validSortField !== 'created_at') {
      query = query.orderBy('created_at', 'desc')
    }

    const notes = await query.paginate(page, perPage)

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
        },
        currentSort: {
          field: validSortField,
          direction: validSortDirection
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
      status: data.status ?? NoteStatus.PENDING,
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

  async togglePin({ params, response, session }: HttpContext) {
    try {
      const note = await Note.find(params.id)
      if (!note) {
        session.flash('error', 'Note not found')
        return response.redirect().back()
      }

      // Toggle the pinned status
      note.pinned = !note.pinned
      await note.save()

      const message = note.pinned ? 'Note pinned successfully' : 'Note unpinned successfully'
      session.flash('success', message)

      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Failed to toggle pin status')
      return response.redirect().back()
    }
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