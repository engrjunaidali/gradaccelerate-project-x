import { z } from 'zod'

/**
 * Validation schema for user signup
 */
export const signupValidator = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().email().toLowerCase(),
  password: z.string().min(6).max(100),
})

/**
 * Validation schema for user login
 */
export const loginValidator = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string(),
})
