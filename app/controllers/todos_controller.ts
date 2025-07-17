import { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'

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
    const data = request.only(['title', 'content', 'labels'])

    const parsedLabels = this.parseLabels(data.labels)

    const todo = await Todo.create({
      title: data.title,
      content: data.content,
      labels: parsedLabels,
    })
    return response.redirect().back()
  }


  async update({ params, request, response }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    const data = request.only(['title', 'content', 'labels'])

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
} 