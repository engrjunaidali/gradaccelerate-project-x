import type { HttpContext } from '@adonisjs/core/http'
import GiphyService from '#services/giphy_service'
import { asyncHandler } from '../utils/asyncHandler.js'

export default class GiphyController {
  private giphyService: GiphyService

  constructor() {
    this.giphyService = new GiphyService()
  }

  /**
   * Search for GIFs based on query
   */
  search = asyncHandler(async ({ request, response }: HttpContext) => {
    console.log('Giphy search request:', request.qs())
    // Change 'query' to 'q' to match the frontend request
    const { q: query, limit = 10, offset = 0 } = request.qs()

    if (!query) {
      return response.badRequest({ message: 'Query parameter is required' })
    }

    try {
      const gifs = await this.giphyService.searchGifs(query, Number(limit), Number(offset))
      // Make sure to return the gifs in the expected format
      return response.json({ gifs })
    } catch (error) {
      console.error('Error in Giphy search:', error)
      return response.internalServerError({
        message: 'Failed to search GIFs',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  })
}
