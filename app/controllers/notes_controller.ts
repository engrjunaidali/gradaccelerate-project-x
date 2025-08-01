import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'
import { NoteStatus } from '../enums/NoteStatus.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { cuid } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'

export default class NotesController {
  /**
   * Display a list of notes
   */
  index = asyncHandler(async ({ inertia, request, auth }: HttpContext) => {
    const page = request.input('page', 1)
    const perPage = 6
    const sortField = request.input('sort', 'created_at')
    const sortDirection = request.input('direction', 'desc')

    // Validate sort field
    const allowedSortFields = ['created_at', 'updated_at', 'title']
    const validSortField = allowedSortFields.includes(sortField) ? sortField : 'created_at'
    const validSortDirection = ['asc', 'desc'].includes(sortDirection) ? sortDirection : 'desc'

    const user = auth.user!

    let query = Note.query()
      .where('user_id', user.id)
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
          to: (notes.currentPage - 1) * notes.perPage + notes.toJSON().data.length,
        },
        currentSort: {
          field: validSortField,
          direction: validSortDirection,
        },
      },
    })
  })
  /**
   * Get a specific note
   */
  show = asyncHandler(async ({ params, response, auth }: HttpContext) => {
    const user = auth.user!
    const note = await Note.query().where('id', params.id).where('user_id', user.id).first()

    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }
    return response.json(note)
  })

  async share({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const note = await Note.query().where('id', params.id).where('user_id', user.id).first()

    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    note.shared_token = cuid()
    note.shared_token_expires_at = DateTime.now().plus({ hours: 24 })
    await note.save()

    const shareableLink = `${process.env.APP_URL}/notes/shared/${note.shared_token}`

    return response.json({
      message: 'Note shared successfully',
      shareableLink,
    })
  }

  async showShared({ params, inertia, response }: HttpContext) {
    const token = params.token
    const note = await Note.query().where('shared_token', token).first()

    if (!note) {
      return response.notFound('Note not found or invalid share link.')
    }

    if (note.shared_token_expires_at && note.shared_token_expires_at < DateTime.now()) {
      return response.badRequest('Share link has expired.')
    }

    return inertia.render('notes/shared', { note })
  }

  /**
   * Store a new note
   */
  store = asyncHandler(async ({ request, response, auth }: HttpContext) => {
    const data = request.only(['title', 'content', 'status', 'labels'])
    const user = auth.user!

    await Note.create({
      title: data.title,
      content: data.content,
      status: data.status ?? NoteStatus.PENDING,
      labels: data.labels ?? [],
      userId: user.id,
    })

    return response.redirect().back()
  })

  /**
   * Update a note
   */
  update = asyncHandler(async ({ params, request, response, auth }: HttpContext) => {
    const user = auth.user!
    const note = await Note.query().where('id', params.id).where('user_id', user.id).first()

    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    const data = request.only(['title', 'content', 'status', 'labels'])
    await note.merge({
      title: data.title,
      content: data.content,
      status: data.status,
      labels: data.labels ?? note.labels
    }).save()
    return response.redirect().back()
  })

  togglePin = asyncHandler(async ({ params, response, session, auth }: HttpContext) => {
    const user = auth.user!
    const note = await Note.query().where('id', params.id).where('user_id', user.id).first()

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
  })

  /**
   * Delete a note
   */
  destroy = asyncHandler(async ({ params, response, auth }: HttpContext) => {
    const user = auth.user!
    const note = await Note.query().where('id', params.id).where('user_id', user.id).first()

    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    await note.delete()
    return response.redirect().back()
  })
}
