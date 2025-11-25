import { test, expect } from '@playwright/test'

test.describe('Admin Login', () => {
  test('login with default credentials and access admin page', async ({ page }) => {
    const base = process.env.BASE_URL || 'http://localhost:3001'
    await page.goto(`${base}/admin/login`)
    await page.locator('#admin-user').fill('admin')
    await page.locator('#admin-pass').fill('admin')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.waitForResponse(/\/api\/admin\/login/)
    const cookies = await page.context().cookies()
    const adminCookie = cookies.find(c => c.name === 'admin_session')
    expect(adminCookie).toBeTruthy()
    await page.goto(`${base}/admin`)
    await expect(page.getByRole('heading', { name: 'Área Administrativa' })).toBeVisible()
    await expect(page.getByText('Usuário autenticado')).toBeVisible()
  })
})
