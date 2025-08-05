import env from '#start/env'

interface GiphyGif {
  id: string
  title: string
  url: string
  images: {
    original: {
      url: string
      width: string
      height: string
    }
    fixed_height: {
      url: string
      width: string
      height: string
    }
    fixed_width: {
      url: string
      width: string
      height: string
    }
    preview_gif: {
      url: string
      width: string
      height: string
    }
  }
}

interface GiphyResponse {
  data: any[]
  pagination: {
    total_count: number
    count: number
    offset: number
  }
}

export default class GiphyService {
  private apiKey: string
  private baseUrl = 'https://api.giphy.com/v1/gifs'

  constructor() {
    this.apiKey = env.get('GIPHY_API_KEY', 'your_default_api_key')
  }

  async searchGifs(query: string, limit: number = 20, offset: number = 0): Promise<GiphyGif[]> {
    try {
      const url = `${this.baseUrl}/search?api_key=${this.apiKey}&q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&rating=g&lang=en`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Giphy API error: ${response.status}`)
      }

      const data: GiphyResponse = await response.json()

      return data.data.map((gif: any) => ({
        id: gif.id,
        title: gif.title,
        url: gif.url,
        images: {
          original: {
            url: gif.images.original.url,
            width: gif.images.original.width,
            height: gif.images.original.height,
          },
          fixed_height: {
            url: gif.images.fixed_height.url,
            width: gif.images.fixed_height.width,
            height: gif.images.fixed_height.height,
          },
          fixed_width: {
            url: gif.images.fixed_width.url,
            width: gif.images.fixed_width.width,
            height: gif.images.fixed_width.height,
          },
          preview_gif: {
            url: gif.images.preview_gif?.url || gif.images.fixed_height.url,
            width: gif.images.preview_gif?.width || gif.images.fixed_height.width,
            height: gif.images.preview_gif?.height || gif.images.fixed_height.height,
          },
        },
      }))
    } catch (error) {
      console.error('Error fetching GIFs from Giphy:', error)
      throw new Error('Failed to fetch GIFs')
    }
  }
}
