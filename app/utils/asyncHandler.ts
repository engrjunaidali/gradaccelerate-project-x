import { HttpContext } from '@adonisjs/core/http'

export const asyncHandler = (fn: (ctx: HttpContext) => Promise<any>) => {
    return async (ctx: HttpContext) => {
        try {
            return await fn(ctx)
        } catch (error) {
            console.error('Controller error:', error)
            return ctx.response.status(500).json({
                error: 'An unexpected error occurred.',
                message: error.message
            })
        }
    }
}
