import { HttpContext } from '@adonisjs/core/http'
import Bookmark from '#models/bookmark'
import { asyncHandler } from '../utils/asyncHandler.js'

export default class BookmarksController {
  /**
   * Display a list of bookmarks
   */
  index = asyncHandler(async ({ inertia, request, auth }: HttpContext) => {
    const page = request.input('page', 1)
    const perPage = 12
    const sortField = request.input('sort', 'created_at')
    const sortDirection = request.input('direction', 'desc')
    const searchQuery = request.input('search', '')
    const filterFavorites = request.input('favorites', false)

    // Validate sort field
    const allowedSortFields = ['created_at', 'updated_at', 'title']
    const validSortField = allowedSortFields.includes(sortField) ? sortField : 'created_at'
    const validSortDirection = ['asc', 'desc'].includes(sortDirection) ? sortDirection : 'desc'

    const user = auth.user!

    let query = Bookmark.query()
      .where('user_id', user.id)
      .orderBy(validSortField, validSortDirection)

    if (searchQuery) {
      query = query.where((builder) => {
        builder
          .whereILike('title', `%${searchQuery}%`)
          .orWhereILike('url', `%${searchQuery}%`)
      })
    }

    if (filterFavorites) {
      query = query.where('is_favorite', true)
    }

    const bookmarks = await query.paginate(page, perPage)

    return inertia.render('bookmarks/index', {
      bookmarks: {
        data: bookmarks.toJSON().data,
        meta: {
          current_page: bookmarks.currentPage,
          last_page: bookmarks.lastPage,
          per_page: bookmarks.perPage,
          total: bookmarks.total,
          from: (bookmarks.currentPage - 1) * bookmarks.perPage + 1,
          to: (bookmarks.currentPage - 1) * bookmarks.perPage + bookmarks.toJSON().data.length,
        },
        currentSort: {
          field: validSortField,
          direction: validSortDirection,
        },
      },
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    })
  })

  /**
   * Get a specific bookmark
   */
  show = asyncHandler(async ({ params, response, auth }: HttpContext) => {
    const user = auth.user!
    const bookmark = await Bookmark.query().where('id', params.id).where('user_id', user.id).first()

    if (!bookmark) {
      return response.notFound({ message: 'Bookmark not found' })
    }
    return response.json(bookmark)
  })

  /**
   * Store a new bookmark
   */
  store = asyncHandler(async ({ request, response, auth }: HttpContext) => {
    const data = request.only(['title', 'url', 'isFavorite'])
    const user = auth.user!

    await Bookmark.create({
      title: data.title,
      url: data.url,
      isFavorite: data.isFavorite ?? false,
      userId: user.id,
    })

    return response.redirect().back()
  })

  /**
   * Update a bookmark
   */
  update = asyncHandler(async ({ params, request, response, auth }: HttpContext) => {
    const user = auth.user!
    const bookmark = await Bookmark.query().where('id', params.id).where('user_id', user.id).first()

    if (!bookmark) {
      return response.notFound({ message: 'Bookmark not found' })
    }

    const data = request.only(['title', 'url', 'isFavorite'])
    await bookmark.merge({
      title: data.title,
      url: data.url,
      isFavorite: data.isFavorite,
    }).save()

    return response.redirect().back()
  })

  /**
   * Toggle favorite status
   */
  toggleFavorite = asyncHandler(async ({ params, response, session, auth }: HttpContext) => {
    const user = auth.user!
    const bookmark = await Bookmark.query().where('id', params.id).where('user_id', user.id).first()

    if (!bookmark) {
      session.flash('error', 'Bookmark not found')
      return response.redirect().back()
    }

    // Toggle the favorite status
    bookmark.isFavorite = !bookmark.isFavorite
    await bookmark.save()

    const message = bookmark.isFavorite ? 'Bookmark added to favorites' : 'Bookmark removed from favorites'
    session.flash('success', message)

    return response.redirect().back()
  })

  /**
   * Delete a bookmark
   */
  destroy = asyncHandler(async ({ params, response, auth }: HttpContext) => {
    const user = auth.user!
    const bookmark = await Bookmark.query().where('id', params.id).where('user_id', user.id).first()

    if (!bookmark) {
      return response.notFound({ message: 'Bookmark not found' })
    }

    await bookmark.delete()
    return response.redirect().back()
  })
}
