import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import env from '#start/env'

export default class GoogleAuthController {
  /**
   * Check if Google OAuth is properly configured
   */
  private isGoogleConfigured(): boolean {
    const clientId = env.get('GOOGLE_CLIENT_ID')
    const clientSecret = env.get('GOOGLE_CLIENT_SECRET')
    return !!(clientId && clientSecret && clientId !== 'dummy-client-id')
  }

  /**
   * Redirect to Google for authentication (Notes App - Session-based)
   */
  async redirectForNotes({ ally, session }: HttpContext) {
    const google = ally.use('google')
    console.log('Redirecting to Google for Notes authentication...', google)
    session.put('auth_app_type', 'notes')
    return google.redirect()
  }

  /**
   * Redirect to Google for authentication (Todo App - JWT-based)
   */
  async redirectForTodos({ ally, session, response }: HttpContext) {
    if (!this.isGoogleConfigured()) {
      return response.redirect('/auth/jwt/login?error=google_not_configured')
    }

    // Store the app type in session to determine redirect after callback
    session.put('auth_app_type', 'todos')
    return ally.use('google').redirect()
  }

  /**
   * Handle Google callback and authenticate user
   */
  public async callback({ ally, auth, response, session }: HttpContext) {
    const googleUser = ally.use('google')

    console.log('Handling Google callback...')

    try {
      /**
       * User has explicitly denied the login request
       */
      if (googleUser.accessDenied()) {
        session.flash('error', 'Google authentication was denied')
        return response.redirect('/auth/session/login')
      }

      /**
       * Unable to verify the CSRF state
       */
      if (googleUser.stateMisMatch()) {
        session.flash('error', 'Authentication request expired. Please try again.')
        return response.redirect('/auth/session/login')
      }

      /**
       * There was an unknown error during the redirect
       */
      if (googleUser.hasError()) {
        session.flash('error', 'Authentication failed. Please try again.')
        return response.redirect('/auth/session/login')
      }

      /**
       * Finally, access the user
       */
      const user = await googleUser.user()
      const appType = session.get('auth_app_type', 'notes')

      const findUser = {
        email: user.email as string
      }

      const userDetails = {
        fullName: user.name as string,
        email: user.email as string,
        password: '' // Google users don't need passwords
      }

      const newUser = await User.firstOrCreate(findUser, userDetails)

      if (appType === 'todos') {
        // For Todo app, create JWT token
        const token = await User.accessTokens.create(newUser)

        // Redirect to a page that will save the JWT token and redirect to todos
        return response.redirect(`/auth/google/token?token=${token.value!.release()}`)
      } else {
        // For Notes app, use session-based authentication
        await auth.use('web').login(newUser)
        session.flash('success', 'Successfully signed in to notes with Google!')
        return response.redirect('/notes')
      }
    } catch (error) {
      console.error('Google Auth Error:', error)
      session.flash('error', 'Authentication failed. Please try again.')
      return response.redirect('/auth/session/login')
    }
  }

  /**
   * Handle JWT token after Google authentication for Todo app
   */
  async handleToken({ request, inertia }: HttpContext) {
    const token = request.qs().token
    return inertia.render('auth/google-token', { token })
  }

  async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Successfully signed out')
    return response.redirect('/auth/session/login')
  }
}
