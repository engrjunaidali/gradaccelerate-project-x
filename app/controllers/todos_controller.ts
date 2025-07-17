import { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'

export default class TodosController {
  /**
   * Display a list of todos
   */
  async index({ inertia }: HttpContext) {
    const todos = await Todo.query().orderBy('created_at', 'desc')
    return inertia.render('todos/index', { todos })
  }

  /**
   * Get a specific todo
   */
  async show({ params, inertia }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    return inertia.render('todos/show', { todo })
  }

  /**
   * Store a new todo
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'content'])
    const todo = await Todo.create(data)
    return response.redirect().back()
  }

  /**
   * Update a todo
   */
  async update({ params, request, response }: HttpContext) {
    const todo = await Todo.find(params.id)
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }

    const data = request.only(['title', 'content'])
    await todo.merge(data).save()
    return response.redirect().back()
  }

  /**
   * Delete a todo
   */
  async destroy({ params, response }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)

    await todo.delete()
    return response.redirect().back()
  }
} 