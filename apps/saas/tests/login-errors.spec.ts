import { test, expect } from '@playwright/test'

test.describe('User Login Scenarios', () => {
  test('register with fake credentials succeeds', async ({ page }) => {
    await page.goto('/')
    await page.click('button[aria-label="Fazer Login"]')
    await page.click('text=Criar conta')
    await page.fill('#name', 'Usuário Teste')
    await page.fill('#reg-email', 'test@test.com')
    await page.fill('#reg-password', '12345678A')
    await page.fill('#confirmPassword', '12345678A')
    await page.click('label:has-text("Aceito os")')
    await page.click('button:has-text("Criar conta")')
    await page.click('button[aria-label="Testar Grátis"]')
    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test('login wrong credentials shows error', async ({ page }) => {
    await page.goto('/')
    await page.click('button[aria-label="Fazer Login"]')
    await page.fill('#email', 'wrong@test.com')
    await page.fill('#password', 'wrongpass')
    await page.click('button:has-text("Entrar")')
    await expect(page.locator('#email')).toHaveCount(1)
    await expect(page).not.toHaveURL(/\/dashboard$/)
  })

  test('OAuth buttons visible and functional (fallback)', async ({ page }) => {
    await page.goto('/')
    await page.click('button[aria-label="Fazer Login"]')
    const googleBtn = page.getByRole('button', { name: 'Entrar Google' })
    const githubBtn = page.getByRole('button', { name: 'Entrar GitHub' })
    await expect(googleBtn).toBeVisible()
    await expect(githubBtn).toBeVisible()
    await googleBtn.click()
    await page.click('button[aria-label="Testar Grátis"]')
    await expect(page).toHaveURL(/\/dashboard$/)
  })
})
