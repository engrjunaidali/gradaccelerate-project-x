import { test, expect } from '@playwright/experimental-ct-react'
import Empty from '#inertia/pages/todos/empty'

test('should work', async ({ mount }) => {
  const component = await mount(<Empty />)
  await expect(component).toContainText('Gracias')
})
