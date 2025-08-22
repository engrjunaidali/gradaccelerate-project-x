import { GoogleGenerativeAI } from '@google/generative-ai'
import gemConfig from '#config/gemini'

export interface BookmarkContent {
  title: string
  description?: string
  siteName?: string
  url: string
}

export default class GeminiService {
  private static genAI: GoogleGenerativeAI | null = null

  /**
   * Initialize the Gemini AI client
   */
  private static getClient(): GoogleGenerativeAI {
    if (!this.genAI) {
      const apiKey = gemConfig.apiKey
      if (!apiKey) {
        throw new Error('Gemini API key is not configured')
      }
      this.genAI = new GoogleGenerativeAI(apiKey)
    }
    return this.genAI
  }

  /**
   * Generate labels for a bookmark based on its metadata
   */
  static async generateLabels(content: BookmarkContent): Promise<string[]> {
    try {
      const genAI = this.getClient()
      const model = genAI.getGenerativeModel({
        model: gemConfig.model || 'gemini-1.5-flash',
        generationConfig: gemConfig.generationConfig,
        safetySettings: gemConfig.safetySettings
      })

      const prompt = this.buildPrompt(content)
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Parse the response to extract labels
      const labels = this.parseLabels(text)
      return labels
    } catch (error) {
      console.error('Error generating labels with Gemini:', error)
      // Return fallback labels based on content analysis
      return this.generateFallbackLabels(content)
    }
  }

  /**
   * Build the prompt for label generation
   */
  private static buildPrompt(content: BookmarkContent): string {
    const parts = []

    parts.push('Generate 3-5 relevant labels/tags for this bookmark based on its content:')
    parts.push(`Title: ${content.title}`)

    if (content.description) {
      parts.push(`Description: ${content.description}`)
    }

    if (content.siteName) {
      parts.push(`Site: ${content.siteName}`)
    }

    parts.push(`URL: ${content.url}`)
    parts.push('')
    parts.push('Requirements:')
    parts.push('- Return only the labels, separated by commas')
    parts.push('- Use lowercase, single words or short phrases')
    parts.push('- Focus on topics, categories, and content type')
    parts.push('- Avoid generic words like "website" or "link"')
    parts.push('- Maximum 5 labels')
    parts.push('')
    parts.push('Example output: technology, programming, tutorial, javascript, web-development')

    return parts.join('\n')
  }

  /**
   * Parse labels from Gemini response
   */
  private static parseLabels(text: string): string[] {
    // Clean up the response text
    const cleanText = text.trim().toLowerCase()

    // Split by commas and clean each label
    const labels = cleanText
      .split(',')
      .map(label => label.trim())
      .filter(label => label.length > 0 && label.length <= 20)
      .slice(0, 5) // Limit to 5 labels

    return labels
  }

  /**
   * Generate fallback labels when Gemini API fails
   */
  private static generateFallbackLabels(content: BookmarkContent): string[] {
    const labels: string[] = []

    // Extract domain-based label
    try {
      const domain = new URL(content.url).hostname.replace('www.', '')
      const domainParts = domain.split('.')
      if (domainParts.length > 1) {
        labels.push(domainParts[0])
      }
    } catch {
      // Ignore URL parsing errors
    }

    // Add site name if available
    if (content.siteName && content.siteName.toLowerCase() !== 'website') {
      labels.push(content.siteName.toLowerCase().replace(/\s+/g, '-'))
    }

    // Analyze title for keywords
    const titleWords = content.title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 3)

    labels.push(...titleWords)

    // Add generic labels based on URL patterns
    if (content.url.includes('github.com')) labels.push('code', 'repository')
    if (content.url.includes('youtube.com')) labels.push('video')
    if (content.url.includes('medium.com')) labels.push('article', 'blog')
    if (content.url.includes('stackoverflow.com')) labels.push('programming', 'qa')
    if (content.url.includes('docs.') || content.url.includes('/docs/')) labels.push('documentation')

    // Remove duplicates and limit to 5
    return [...new Set(labels)].slice(0, 5)
  }

  /**
   * Generate a summary for bookmark content
   */
  static async generateSummary(content: BookmarkContent): Promise<string | null> {
    try {
      const genAI = this.getClient()
      const model = genAI.getGenerativeModel({
        model: gemConfig.model || 'gemini-1.5-flash',
        generationConfig: {
          ...gemConfig.generationConfig,
          maxOutputTokens: 150
        }
      })

      const prompt = `Summarize this bookmark in 1-2 sentences:\n\nTitle: ${content.title}\n${content.description ? `Description: ${content.description}\n` : ''}URL: ${content.url}`

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text().trim()
    } catch (error) {
      console.error('Error generating summary with Gemini:', error)
      return null
    }
  }
}
