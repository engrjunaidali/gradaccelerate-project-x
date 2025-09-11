import { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'
import { fileURLToPath } from 'url';
import path from 'path'
import {todoSchema, todoIdSchema, TodoImageValidator, updateTodoSchema} from '../../inertia/schemas/todoSchema.js'

import { TodoPriority } from '../enums/TodoPriority.js'
import { TodoStatus } from '../enums/TodoStatus.js'

import CloudinaryService from '#services/cloudinary_service'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class TodosController {
  async index({ response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const todos = await Todo.query()
      .where('userId', user.id)
      .orderBy('created_at', 'desc')
    return response.json({ todos })
  }

  async show({ params, inertia, response, auth }: HttpContext) {
    try {
      const validatedParams = todoIdSchema.safeParse({
        id: params.id
      })

      if (!validatedParams.success) {
        return response.badRequest({
          error: 'Invalid ID',
          details: validatedParams.error.issues
        })
      }
      const user = auth.getUserOrFail()
      const todo = await Todo.query()
        .where('id', validatedParams.id)
        .where('userId', user.id)
        .firstOrFail()
      return inertia.render('todos/show', { todo })
    } catch (error) {
      return response.redirect('/todos')
    }
  }



  async store({ request, response, auth }: HttpContext) {
    try {
      const body = request.all()
      const validationResult = todoSchema.safeParse(body)

      if (!validationResult.success) {
        return response.badRequest({
          error: 'Validation failed',
          details: validationResult.error.issues
        })
      }

      const data = validationResult.data
      const parsedLabels = this.parseLabels(data.labels)

      const user = auth.getUserOrFail()

      console.error('Saving data', data)
      console.log('Saving data', data)

      const todo = await Todo.create({
        title: data.title,
        content: data.content,
        status: data?.status.toLowerCase() || TodoStatus.PENDING.toLowerCase(),
        labels: parsedLabels,
        imageUrl: data.imageUrl || '',
        priority: data.priority.toLowerCase() || TodoPriority.MEDIUM.toLowerCase(),
        userId: user.id
      })

      return response.json({ todo })
    } catch (error) {
      console.error('Store error:', error)

      // Handle validation errors specifically
      if (error.messages) {
        return response.badRequest({
          error: 'Validation failed',
          details: error.messages
        })
      }

      return response.badRequest({ error: error })
    }
  }


  async update({ params, request, response, auth }: HttpContext) {
    try {
      const validatedParams = todoIdSchema.safeParse({
        id: params.id
      })

      if (!validatedParams.success) {
        return response.badRequest({
          error: 'Invalid ID',
          details: validatedParams.error.issues
        })
      }

      const body = request.all()
      console.log('Update request body:', body)

      const validatedData = updateTodoSchema.safeParse(body)

      if (!validatedData.success) {
        return response.badRequest({
          error: 'Validation failed',
          details: validatedData.error.issues
        })
      }

      const user = auth.getUserOrFail()

      const todo = await Todo.query()
        .where('id', validatedParams.data.id)
        .where('userId', user.id)
        .firstOrFail()

      // Only update fields that were provided and validated
      const updateData: any = {}
      if (validatedData.data.title !== undefined) updateData.title = validatedData.data.title
      if (validatedData.data.content !== undefined) updateData.content = validatedData.data.content
      if (validatedData.data.status !== undefined) updateData.status = validatedData.data.status.toLowerCase()
      if (validatedData.data.labels !== undefined) updateData.labels = this.parseLabels(validatedData.data.labels)
      if (validatedData.data.imageUrl !== undefined) updateData.imageUrl = validatedData.data.imageUrl
      if (validatedData.data.priority !== undefined) updateData.priority = validatedData.data.priority.toLowerCase()

      todo.merge(updateData)
      await todo.save()

      return response.json({ todo })
    } catch (error) {
      console.error('Update error:', error)
      return response.badRequest({ error: 'Failed to update todo' })
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    try {
      const validatedParams = todoIdSchema.safeParse({
        id: params.id
      })

      if (!validatedParams.success) {
        return response.badRequest({
          error: 'Invalid ID',
          details: validatedParams.error.issues
        })
      }

      const user = auth.getUserOrFail()
      const todo = await Todo.query()
        .where('id', validatedParams.data.id)
        .where('userId', user.id)
        .firstOrFail()

      await todo.delete()
      return response.json({ message: 'Todo deleted successfully' })
    } catch (error) {
      return response.badRequest({ error: 'Failed to delete todo' })
    }
  }

  public async uploadImage({ request, response }: HttpContext) {
    try {
      const imageFile = request.file('image')

      if (!imageFile) {
        return response.badRequest({ error: 'No image file provided' })
      }

       const validationResult = TodoImageValidator.safeParse({
        extname: imageFile.extname,
        size: imageFile.size,
      })

      if (!validationResult.success) {
        return response.badRequest({
          error: validationResult.error.issues.map((e) => e.message).join(', '),
        })
      }

      const result = await new CloudinaryService(imageFile.tmpPath!, 'adonis_uploads').upload()

      return response.ok({
        message: 'Image uploaded successfully',
        url: result.url,
        publicId: result.publicId,
      })
    } catch (error) {
      console.error('Image Upload Error:', error)
      return response.internalServerError({ error: error.message || 'Failed to upload image' })
    }
  }

  private parseLabels(labels: string[] | string | undefined): string[] | null {
    if (!labels) return null

    if (Array.isArray(labels)) {
      const cleanedLabels = labels.map(label => label.trim()).filter(Boolean)
      return cleanedLabels.length > 0 ? cleanedLabels : null
    }

    // If it's a string, split it (for backward compatibility)
    const splitLabels = labels.split(',')
      .map(l => l.trim())
      .filter(Boolean)
    return splitLabels.length > 0 ? splitLabels : null
  }
}
