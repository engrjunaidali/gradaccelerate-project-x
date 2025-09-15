import { test } from '@japa/runner'
import User from '#models/user'
import Todo from '#models/todo'
import { TodoStatus } from '../../app/enums/TodoStatus.js'
import { TodoPriority } from '../../app/enums/TodoPriority.js'

test.group('Todos Mock APIs', (group) => {
  let user: User
  let authToken: string

  group.setup(async () => {
    // Create test user
    user = await User.create({
      email: 'todos-test@example.com',
      password: 'password123',
      fullName: 'Todos Test User'
    })

    // Create auth token for the user
    const token = await User.accessTokens.create(user)
    authToken = token.value!.release()
  })

  group.teardown(async () => {
    // Delete user and all related data
    await user.delete()
  })

  group.each.setup(async () => {
    // Clean up todos before each test
    await Todo.query().where('userId', user.id).delete()
  })

  test('POST /api/todos - Create todo', async ({ client, expect }) => {
    const response = await client
      .post('/api/todos')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        title: 'Test Todo',
        content: 'Test content',
        status: TodoStatus.PENDING,
        priority: TodoPriority.MEDIUM
      })

    response.assertStatus(200)
    expect(response.body().todo.title).toBe('Test Todo')
  })

  test('GET /api/todos - Read all todos', async ({ client, expect }) => {
    // Create test todo
    await Todo.create({
      title: 'Test Todo',
      content: 'Test content',
      status: TodoStatus.PENDING,
      priority: TodoPriority.MEDIUM,
      userId: user.id
    })

    const response = await client
      .get('/api/todos')
      .header('Authorization', `Bearer ${authToken}`)

    response.assertStatus(200)
    expect(response.body().todos).toHaveLength(1)
  })

  test('DELETE /api/todos/:id - Delete todo', async ({ client }) => {
    // Create test todo to delete
    const todo = await Todo.create({
      title: 'Todo to Delete',
      content: 'This will be deleted',
      status: TodoStatus.PENDING,
      priority: TodoPriority.LOW,
      userId: user.id
    })

    const response = await client
      .delete(`/api/todos/${todo.id}`)
      .header('Authorization', `Bearer ${authToken}`)

    response.assertStatus(200)
  })

  test('GET /api/todos - Authentication required', async ({ client }) => {
    const response = await client.get('/api/todos')
    response.assertStatus(401)
  })
})
