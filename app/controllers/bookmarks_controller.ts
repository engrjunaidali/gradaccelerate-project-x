import { HttpContext } from '@adonisjs/core/http'
import Bookmark from '#models/bookmark'
import { asyncHandler } from '../utils/asyncHandler.js'
import OpenGraphService from '#services/open_graph_service'
import GeminiService from '#services/gemini_service'

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
    const filterLabel = request.input('label', '')

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

    if (filterLabel) {
      query = query.whereRaw('JSON_CONTAINS(labels, ?)', [`"${filterLabel}"`])
    }

    const bookmarks = await query.paginate(page, perPage)

    // Get all unique labels for filtering
    const allBookmarks = await Bookmark.query().where('user_id', user.id).select('labels')
    const allLabels = new Set<string>()
    allBookmarks.forEach(bookmark => {
      if (bookmark.labels && Array.isArray(bookmark.labels)) {
        bookmark.labels.forEach(label => allLabels.add(label))
      }
    })
    const availableLabels = Array.from(allLabels).sort()

    return inertia.render('bookmarks/index', {
      csrfToken: request.csrfToken,
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
      availableLabels,
      currentLabel: filterLabel,
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

    const metadata = await OpenGraphService.fetchMetadata(data.url)

    // Use provided title or fallback to Open Graph title
    const title = data.title || metadata?.title || OpenGraphService.extractDomain(data.url)

    // Create fallback metadata if Open Graph fetch failed
    const finalMetadata = metadata || OpenGraphService.generateFallbackMetadata(data.url, title)

    // Generate AI labels using Gemini
    let labels: string[] = []
    try {
      labels = await GeminiService.generateLabels({
        title,
        description: finalMetadata.description || undefined,
        siteName: finalMetadata.siteName || undefined,
        url: data.url
      })
    } catch (error) {
      console.warn('Failed to generate labels with Gemini:', error)
      // Continue without labels if AI generation fails
    }

    await Bookmark.create({
      title,
      url: data.url,
      isFavorite: data.isFavorite ?? false,
      description: finalMetadata.description,
      imageUrl: finalMetadata.imageUrl,
      siteName: finalMetadata.siteName,
      ogType: finalMetadata.ogType,
      labels,
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

    // If URL changed, fetch new metadata
    let metadata = null
    if (data.url && data.url !== bookmark.url) {
      metadata = await OpenGraphService.fetchMetadata(data.url)
    }

    const updateData: any = {
      title: data.title,
      url: data.url,
      isFavorite: data.isFavorite,
    }

    // Update metadata if URL changed
    if (metadata) {
      updateData.description = metadata.description
      updateData.imageUrl = metadata.imageUrl
      updateData.siteName = metadata.siteName
      updateData.ogType = metadata.ogType

      // Regenerate labels for new URL
      try {
        const labels = await GeminiService.generateLabels({
          title: data.title || bookmark.title,
          description: metadata.description || undefined,
          siteName: metadata.siteName || undefined,
          url: data.url
        })
        updateData.labels = labels
      } catch (error) {
        console.warn('Failed to regenerate labels with Gemini:', error)
      }
    }

    await bookmark.merge(updateData).save()

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
   * Preview metadata for a URL
   */
  preview = asyncHandler(async ({ request, response }: HttpContext) => {
    const { url } = request.only(['url'])

    if (!url) {
      return response.badRequest({ message: 'URL is required' })
    }

    try {
      const metadata = await OpenGraphService.fetchMetadata(url)
      const fallbackMetadata = OpenGraphService.generateFallbackMetadata(url)

      return response.json(metadata || fallbackMetadata)
    } catch (error) {
      console.error('Error fetching metadata preview:', error)
      return response.json(OpenGraphService.generateFallbackMetadata(url))
    }
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

  generateTLDR = asyncHandler(async ({ params, response, auth }: HttpContext) => {
    const user = auth.user!
    const bookmark = await Bookmark.query().where('id', params.id).where('user_id', user.id).first()

    if (!bookmark) {
      return response.notFound({ message: 'Bookmark not found' })
    }

    try {
      // Generate TL;DR summary using Gemini
      const summary = await GeminiService.generateTLDR({
        title: bookmark.title,
        description: bookmark.description || undefined,
        siteName: bookmark.siteName || undefined,
        url: bookmark.url
      })

      if (summary) {
        // Save the summary to the bookmark
        bookmark.summary = summary
        await bookmark.save()

        return response.json({
          success: true,
          summary,
          message: 'TL;DR generated successfully'
        })
      } else {
        return response.json({
          success: false,
          message: 'Failed to generate TL;DR summary'
        })
      }
    } catch (error) {
      console.error('Error generating TL;DR:', error)
      return response.status(500).json({
        success: false,
        message: 'An error occurred while generating the summary'
      })
    }
  })
}
