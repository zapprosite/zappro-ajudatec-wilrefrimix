import { test, expect } from '@playwright/test'

test.describe('Admin Login Errors', () => {
  test('wrong username returns 401', async ({ request }) => {
    const base = process.env.BASE_URL || 'http://localhost:3001'
    const res = await request.post(`${base}/api/admin/login`, {
      data: { username: 'wrong', password: 'admin' },
    })
    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.error).toContain('Credenciais inválidas')
  })

  test('wrong password returns 401', async ({ request }) => {
    const base = process.env.BASE_URL || 'http://localhost:3001'
    const res = await request.post(`${base}/api/admin/login`, {
      data: { username: 'admin', password: 'wrong' },
    })
    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.error).toContain('Credenciais inválidas')
  })

  test('logout clears cookie', async ({ page }) => {
    const base = process.env.BASE_URL || 'http://localhost:3001'
    await page.goto(`${base}/admin/login`)
    await page.locator('#admin-user').fill('admin')
    await page.locator('#admin-pass').fill('admin')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.waitForResponse(/\/api\/admin\/login/)
    const cookiesBefore = await page.context().cookies()
    const hasCookie = cookiesBefore.find(c => c.name === 'admin_session')
    expect(hasCookie).toBeTruthy()
    await page.goto(`${base}/admin`)
    await page.getByRole('button', { name: 'Sair' }).click()
    await page.waitForTimeout(500)
    const cookiesAfter = await page.context().cookies()
    const cleared = cookiesAfter.find(c => c.name === 'admin_session')
    expect(cleared?.value || '').toBe('')
  })
})

