import { test, expect } from '@playwright/test'

test('login OAuth Google (fallback dev) e acessar dashboard', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Fazer Login' }).click()
  const googleBtn = page.getByRole('button', { name: 'Entrar Google' })
  await expect(googleBtn).toBeVisible()
  await googleBtn.click()
  await page.getByRole('button', { name: 'Testar Grátis' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.goto('/chat')
  await page.fill('textarea[aria-label="Mensagem"]', 'Teste OAuth Google')
  await page.click('button[aria-label="Enviar mensagem"]')
  await page.waitForResponse(/\/api\/openai\/chat/)
  await expect(page.getByText('ZapPRO IA').first()).toBeVisible()
})
