import User from '#models/user'
import { test } from '@japa/runner'
import { afterEach } from 'node:test'

test.group('User Model Tests', () => {
  let createdUser: User | null

  afterEach(async () => {
    if (createdUser) {
      await createdUser.delete()
    }
  })

  test('should create a new user successfully', async ({ expect }) => {

    const uniqueEmail = `test${Date.now()}@example.com`
    const user = await User.create({
      fullName: 'Test User',
      email: uniqueEmail,
      password: 'secure123'
    })
    expect(user.fullName).toBe('Test User')
    expect(user.email).toBe(uniqueEmail)
    createdUser = user
  })

  test('should find a user by id', async ({ expect }) => {
    const uniqueEmail = `test${Date.now()}@example.com`
    const user = await User.create({
      fullName: 'Find User',
      email: uniqueEmail,
      password: 'secure123'
    })
    const foundUser = await User.find(user.id)
    expect(foundUser?.id).toBe(user.id)
    createdUser = user
  })

  test('should update user information', async ({ expect }) => {

    const uniqueEmail = `test${Date.now()}@example.com`

    const user = await User.create({
      fullName: 'Update User',
      email: uniqueEmail,
      password: 'secure123'
    })
    await user.merge({ fullName: 'Updated Name' }).save()
    const updatedUser = await User.find(user.id)
    expect(updatedUser?.fullName).toBe('Updated Name')
    createdUser = user
  })

  test('should delete a user', async ({ expect }) => {
    const user = await User.create({
      fullName: 'Delete User',
      email: 'delete@example.com',
      password: 'secure123'
    })
    await user.delete()
    const deletedUser = await User.find(user.id)
    expect(deletedUser).toBeNull()
  })
})
