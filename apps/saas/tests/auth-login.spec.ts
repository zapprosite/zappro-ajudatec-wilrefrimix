import { test, expect } from '@playwright/test'

test('login por email via modal na landing e acesso ao dashboard', async ({ page }) => {
  await page.goto('/')
  await page.click('button[aria-label="Fazer Login"]')
  await page.fill('#email', 'test@test.com')
  await page.fill('#password', '12345678A')
  await page.click('button:has-text("Entrar")')
  await expect(page.locator('#email')).toHaveCount(0)
  await page.click('button[aria-label="Testar Grátis"]')
  await expect(page).toHaveURL(/\/dashboard$/)
})

