import { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'
import Cloudinary from '../../config/cloudinary.js'
import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path'

import cloudinary from '#config/cloudinary';
import { ImageValidator, TodoIdValidator, CreateTodoValidator, UpdateTodoValidator } from '../validators/todo.js'


import CloudinaryService from '#services/cloudinary_service'



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class TodosController {
  async index({ inertia }: HttpContext) {
    const todos = await Todo.query().orderBy('created_at', 'desc')
    return inertia.render('todos/index', { todos })
  }

  async show({ params, inertia, response }: HttpContext) {
    try {
      const validatedParams = await TodoIdValidator.validate(params)
      const todo = await Todo.findOrFail(validatedParams.id)
      return inertia.render('todos/show', { todo })
    } catch (error) {
      // Handle validation errors or record not found
      return response.redirect('/todos')
    }
  }



  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(CreateTodoValidator)
      const parsedLabels = this.parseLabels(data.labels)

      console.error('Saving data', data)
      console.log('Saving data', data)

      const todo = await Todo.create({
        title: data.title,
        content: data.content,
        labels: parsedLabels,
        imageUrl: data.imageUrl || null
      })

      return response.redirect().back()
    } catch (error) {
      console.error('Store error:', error)
      return response.redirect().back()
    }
  }


  async update({ params, request, response }: HttpContext) {
    try {
      const validatedParams = await TodoIdValidator.validate(params)
      const validatedData = await request.validateUsing(UpdateTodoValidator)

      const todo = await Todo.findOrFail(validatedParams.id)

      // Only update fields that were provided and validated
      const updateData: any = {}
      if (validatedData.title !== undefined) updateData.title = validatedData.title
      if (validatedData.content !== undefined) updateData.content = validatedData.content
      if (validatedData.labels !== undefined) updateData.labels = this.parseLabels(validatedData.labels)
      if (validatedData.imageUrl !== undefined) updateData.imageUrl = validatedData.imageUrl

      todo.merge(updateData)
      await todo.save()

      return response.redirect().back()
    } catch (error) {
      console.error('Update error:', error)
      return response.redirect().back()
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const validatedParams = await TodoIdValidator.validate(params)
      const todo = await Todo.findOrFail(validatedParams.id)

      await todo.delete()
      return response.redirect().back()
    } catch (error) {
      return response.redirect('/todos')
    }
  }
  private parseLabels(labels: string | undefined): string[] | null {
    if (!labels) return null

    const splitLabels = labels.split(',')
      .map(l => l.trim())
      .filter(Boolean)
    return splitLabels.length > 0 ? splitLabels : null
  }
  public async uploadImage({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(ImageValidator)

      if (!payload.image) {
        return response.badRequest({ error: 'No image file provided' })
      }

      const result = await new CloudinaryService(payload.image.tmpPath!, 'adonis_uploads').upload()

      return response.ok({
        message: 'Image uploaded successfully',
        url: result.url,
        publicId: result.publicId
      })
    } catch (error) {
      console.error('Image Upload Error:', error)
      return response.internalServerError({ error: 'Failed to upload image' })
    }
  }
} 