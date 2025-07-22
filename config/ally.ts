import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

const allyConfig = defineConfig({
  google: services.google({
    clientId: env.get('GOOGLE_CLIENT_ID') || '404309581900-jrusna7s72crd8nrffsoonk4k0qfitu4.apps.googleusercontent.com',
    clientSecret: env.get('GOOGLE_CLIENT_SECRET') || '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',
    callbackUrl: 'http://localhost:3333/auth/google/callback',
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
