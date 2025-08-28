import ogs from 'open-graph-scraper'

export interface OpenGraphData {
  title?: string
  description?: string
  imageUrl?: string
  siteName?: string
  ogType?: string
  url?: string
}

export default class OpenGraphService {
  /**
   * Fetch Open Graph metadata from a URL
   */
  static async fetchMetadata(url: string): Promise<OpenGraphData | null> {
    try {
      // Validate URL format
      new URL(url)
      
      const { result } = await ogs({ 
        url,
        timeout: 10000, // 10 second timeout
        retry: 2,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BookmarkBot/1.0)'
        }
      })

      if (!result.success) {
        console.warn(`Failed to fetch Open Graph data for ${url}:`, result.error)
        return null
      }

      return {
        title: result.ogTitle || result.twitterTitle || result.dcTitle || undefined,
        description: result.ogDescription || result.twitterDescription || result.dcDescription || undefined,
        imageUrl: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || undefined,
        siteName: result.ogSiteName || undefined,
        ogType: result.ogType || undefined,
        url: result.ogUrl || url
      }
    } catch (error) {
      console.error(`Error fetching Open Graph data for ${url}:`, error)
      return null
    }
  }

  /**
   * Extract domain name from URL for fallback site name
   */
  static extractDomain(url: string): string {
    try {
      const domain = new URL(url).hostname
      return domain.replace('www.', '')
    } catch {
      return url
    }
  }

  /**
   * Generate fallback metadata when Open Graph data is not available
   */
  static generateFallbackMetadata(url: string, title?: string): OpenGraphData {
    return {
      title: title || this.extractDomain(url),
      description: undefined,
      imageUrl: undefined,
      siteName: this.extractDomain(url),
      ogType: 'website',
      url
    }
  }
}