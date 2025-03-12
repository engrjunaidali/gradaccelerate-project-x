import { test } from '@japa/runner'

test.group('Home page', () => {
  test('see welcome message', async ({ visit }) => {
    const page = await visit('/')
    await page.assertExists('body')
  })
})
