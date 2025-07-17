import { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'
import Cloudinary from '../../config/cloudinary.js'
import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path'

import cloudinary from '#config/cloudinary';
import { ImageValidator } from '../validators/todo.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class TodosController {
  async index({ inertia }: HttpContext) {
    const todos = await Todo.query().orderBy('created_at', 'desc')
    return inertia.render('todos/index', { todos })
  }

  async show({ params, inertia }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    return inertia.render('todos/show', { todo })
  }



  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'content', 'labels', 'imageUrl'])

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
  }


  async update({ params, request, response }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    const data = request.only(['title', 'content', 'labels', 'imageUrl'])

    todo.merge(data)
    await todo.save()

    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)

    await todo.delete()
    return response.redirect().back()
  }

  private parseLabels(labels: any): string[] | null {
    if (!labels) return null

    if (Array.isArray(labels)) {
      const filtered = labels.filter(label => typeof label === 'string' && label.trim())
      return filtered.length > 0 ? filtered : null
    }

    if (typeof labels === 'string') {
      try {
        const parsed = JSON.parse(labels)
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(label => typeof label === 'string' && label.trim())
          return filtered.length > 0 ? filtered : null
        }
      } catch {
        const splitLabels = labels.split(',')
          .map(l => l.trim())
          .filter(Boolean)
        return splitLabels.length > 0 ? splitLabels : null
      }
    }

    return null
  }

  public async uploadImage({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(ImageValidator)

      if (!payload.image) {
        return response.badRequest({ error: 'No image file provided' })
      }

      const result = await cloudinary.uploader.upload(payload.image.tmpPath!, {
        folder: 'adonis_uploads',
      })

      return response.ok({ message: 'Image uploaded successfully', url: result.secure_url })
    } catch (error) {
      console.error('Image Upload Error:', error)
      return response.internalServerError({ error: 'Failed to upload image' })
    }
  }
} 