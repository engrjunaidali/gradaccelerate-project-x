import env from '#start/env'

const geminiConfig = {
  /*
  |--------------------------------------------------------------------------
  | Google Gemini API Configuration
  |--------------------------------------------------------------------------
  |
  | Configuration for Google Gemini AI API integration
  |
  */
  apiKey: env.get('GEMINI_API_KEY'),

  /*
  |--------------------------------------------------------------------------
  | Model Configuration
  |--------------------------------------------------------------------------
  |
  | Default model to use for text generation
  |
  */
  model: 'gemini-1.5-flash',

  /*
  |--------------------------------------------------------------------------
  | Generation Configuration
  |--------------------------------------------------------------------------
  |
  | Default settings for content generation
  |
  */
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 100,
  },

  /*
  |--------------------------------------------------------------------------
  | Safety Settings
  |--------------------------------------------------------------------------
  |
  | Content safety filters
  |
  */
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
}

export default geminiConfig
