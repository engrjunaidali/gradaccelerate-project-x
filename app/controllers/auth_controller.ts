import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { asyncHandler } from '../utils/asyncHandler.js'
import { z } from 'zod'

import { signupValidator, loginValidator } from '#validators/auth'
import hash from '@adonisjs/core/services/hash'

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
      return response.redirect('/')
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
      return response.redirect('/')
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





  /**
   * JWT-based signup for Todo App
   */
  jwtSignup = async ({ request, response }: HttpContext) => {
    const data = signupValidator.parse(request.all())
    const user = await User.create(data)
    const token = await User.accessTokens.create(user)

    return response.json({
      type: 'bearer',
      value: token.value!.release(),
    })
  }

  /**
   * JWT-based login for Todo App
   */
  jwtLogin = async ({ request, response }: HttpContext) => {
    const data = loginValidator.parse(request.all())
    const user = await User.findBy('email', data.email)

    if (!user) {
      return response.badRequest({ error: 'Invalid credentials' })
    }

    const scrypt = hash.use('scrypt')
    const isValid = await scrypt.verify(user.password, data.password)

    if (!isValid) {
      return response.badRequest({ error: 'Invalid credentials' })
    }

    const token = await User.accessTokens.create(user)

    return response.json({
      type: 'bearer',
      value: token.value!.release(),
    })
  }

  /**
   * JWT-based logout for Todo App
   */
  jwtLogout = async ({ response, auth }: HttpContext) => {
    const user = auth.use('api').getUserOrFail()
    const token = auth.getAccessTokenOrFail()
    await User.accessTokens.delete(user, token.identifier)
    return response.ok({ message: 'Logged out successfully' })
  }
}
