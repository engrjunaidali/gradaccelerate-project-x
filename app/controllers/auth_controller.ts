import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { asyncHandler } from '../utils/asyncHandler.js'
import { z } from 'zod'

import { signupValidator, loginValidator } from '../validators/auth.js'

// Use imported validators

export default class AuthController {
  /**
   * Session-based signup for Notes App
   */
  sessionSignup = asyncHandler(async ({ request, response, auth, session }: HttpContext) => {
    try {
      const data = signupValidator.parse(request.all())

      // Check if user already exists
      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        session.flash('error', 'User with this email already exists')
        return response.redirect().back()
      }

      // Create new user
      const user = await User.create({
        fullName: data.fullName,
        email: data.email,
        password: data.password, // This will be automatically hashed by the model
      })

      // Login the user using session
      await auth.use('web').login(user)

      session.flash('success', 'Account created successfully!')
      return response.redirect('/notes')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues.map(err => err.message).join(', ')
        session.flash('error', errorMessage)
      } else {
        session.flash('error', 'Failed to create account')
      }
      return response.redirect().back()
    }
  })

  /**
   * Session-based login for Notes App
   */
  sessionLogin = asyncHandler(async ({ request, response, auth, session }: HttpContext) => {
    try {
      const data = loginValidator.parse(request.all())

      const user = await User.verifyCredentials(data.email, data.password)
      await auth.use('web').login(user)

      session.flash('success', 'Logged in successfully!')
      return response.redirect('/notes')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues.map(err => err.message).join(', ')
        session.flash('error', errorMessage)
      } else {
        session.flash('error', 'Invalid credentials')
      }
      return response.redirect().back()
    }
  })

  /**
   * Session-based logout for Notes App
   */
  sessionLogout = asyncHandler(async ({ response, auth, session }: HttpContext) => {
    await auth.use('web').logout()
    session.flash('success', 'Logged out successfully!')
    return response.redirect('/')
  })
}
