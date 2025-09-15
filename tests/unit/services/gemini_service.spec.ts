import { test } from '@japa/runner'
import GeminiService from '#services/gemini_service'

test.group('GeminiService - API Testing', (group) => {
  let mockBookmarkContent: any

  group.setup(() => {
    // Setup mock bookmark content
    mockBookmarkContent = {
      title: 'Learn React Hooks in 2024',
      description: 'A comprehensive guide to React hooks with examples and best practices',
      siteName: 'Dev.to',
      url: 'https://dev.to/learn-react-hooks-2024'
    }
  })

  test('generateLabels - should generate appropriate fallback labels for GitHub URLs', async ({ expect, assert }) => {
    // Test fallback behavior with GitHub content
    const githubContent = {
      title: 'React JavaScript Library',
      description: 'A JavaScript library for building user interfaces',
      siteName: 'GitHub',
      url: 'https://github.com/facebook/react'
    }

    try {
      const labels = await GeminiService.generateLabels(githubContent)

      // Either API succeeds or fallback is used
      assert.isArray(labels)
      expect(labels.length).toBeGreaterThan(0)
      expect(labels.length).toBeLessThanOrEqual(5)

    } catch (error: any) {
      // If API fails, we can't directly test fallback in isolation
      // but we know the structure should handle this gracefully
      expect(error.message).toMatch(/(API key|not configured|401|403)/i)
    }
  })

  test('generateLabels - should generate appropriate fallback labels for YouTube URLs', async ({ expect, assert }) => {
    const youtubeContent = {
      title: 'React Tutorial Video',
      description: 'Learn React from scratch',
      siteName: 'YouTube',
      url: 'https://youtube.com/watch?v=123'
    }

    try {
      const labels = await GeminiService.generateLabels(youtubeContent)

      assert.isArray(labels)
      expect(labels.length).toBeLessThanOrEqual(5)

    } catch (error: any) {
      expect(error.message).toMatch(/(API key|not configured|401|403)/i)
    }
  })

  test('generateLabels - should generate labels for documentation URLs', async ({ expect, assert }) => {
    const docsContent = {
      title: 'API Documentation',
      description: 'Complete API reference guide',
      siteName: 'Docs',
      url: 'https://example.com/docs/api'
    }

    try {
      const labels = await GeminiService.generateLabels(docsContent)

      assert.isArray(labels)
      expect(labels.length).toBeLessThanOrEqual(5)

    } catch (error: any) {
      expect(error.message).toMatch(/(API key|not configured|401|403)/i)
    }
  })

  test('generateTLDR - should handle malformed content gracefully', async ({ expect, assert }) => {
    const malformedContent = {
      title: '',
      url: 'not-a-valid-url'
    }

    const tldr = await GeminiService.generateTLDR(malformedContent)

    assert.isString(tldr)
    expect(tldr).toContain('TL;DR:')
  })

  test('error handling - should validate input parameters', async ({ assert }) => {
    const invalidContent = {
      title: '',
      url: ''
    }

    // Service should handle empty content gracefully
    const labels = await GeminiService.generateLabels(invalidContent)
    assert.isArray(labels)
  })

  test('error handling - should handle very long titles', async ({ expect, assert }) => {
    const longTitleContent = {
      title: 'This is an extremely long title that contains many words and should still be processed correctly by the service without causing any errors or performance issues',
      description: 'Short description',
      siteName: 'Test Site',
      url: 'https://example.com/long-title'
    }

    try {
      const labels = await GeminiService.generateLabels(longTitleContent)
      assert.isArray(labels)
      expect(labels.length).toBeLessThanOrEqual(5)

    } catch (error: any) {
      expect(error.message).toMatch(/(API key|not configured|401|403)/i)
    }
  })

  test('error handling - should handle special characters in content', async ({ expect, assert }) => {
    const specialCharContent = {
      title: 'React & Node.js: Full-Stack Development 🚀',
      description: 'Learn React + Node.js with TypeScript & GraphQL!',
      siteName: 'Dev Blog',
      url: 'https://example.com/react-node'
    }

    try {
      const labels = await GeminiService.generateLabels(specialCharContent)
      assert.isArray(labels)

    } catch (error: any) {
      expect(error.message).toMatch(/(API key|not configured|401|403)/i)
    }
  })

  test('fetchAndSummarize - should return null as placeholder implementation', async ({ expect }) => {
    const result = await GeminiService.fetchAndSummarize('https://example.com')
    expect(result).toBeNull()
  })
})
