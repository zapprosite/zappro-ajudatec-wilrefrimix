import { test, expect, devices } from '@playwright/test'

test.use({
  locale: 'pt-BR',
  timezoneId: 'America/Sao_Paulo',
  geolocation: { latitude: -23.5505, longitude: -46.6333 },
  permissions: ['geolocation'],
})

test.describe('HVAC-R BR navegação técnica', () => {
  test('perfil técnico e contexto brasileiro', async ({ page }) => {
    await page.goto('/chat')
    await page.evaluate(() => {
      localStorage.setItem('hvac_profile', JSON.stringify({
        nome: 'Técnico Sênior HVAC-R',
        reg_crea: 'SP-123456',
        experiencia: '10+ anos',
        mercado: 'Brasil',
        marcas: ['Midea','Samsung','LG','Gree','Daikin']
      }))
    })
    await page.reload()
    await expect(page.getByText('ZapPRO IA').first()).toBeVisible()
  })

  test('fluxo principal: diagnóstico erro 3 piscadas (Samsung)', async ({ page }) => {
    await page.goto('/chat')
    await page.fill('textarea[aria-label="Mensagem"]', 'Samsung Inverter 12000 BTU: led pisca 3x, compressor não parte')
    await page.click('button[aria-label="Enviar mensagem"]')
    await page.waitForTimeout(700)
    await expect(page.locator('text=ZapPRO IA')).toBeVisible()
  })

  test('situação de erro comum: API não configurada', async ({ page }) => {
    await page.goto('/chat')
    await page.fill('textarea[aria-label="Mensagem"]', 'Qual o procedimento para IPM queimado?')
    await page.click('button[aria-label="Enviar mensagem"]')
    await page.waitForTimeout(700)
    await expect(page.getByText(/api/i)).toHaveCount(0)
  })

  test('interação com sistema: ação rápida Esquema Elétrico', async ({ page }) => {
    await page.goto('/chat')
    await page.fill('textarea[aria-label="Mensagem"]', 'Preciso do esquema elétrico do compressor')
    await page.click('button[aria-label="Enviar mensagem"]')
    await page.waitForTimeout(700)
    await expect(page.getByText('ZapPRO IA').first()).toBeVisible()
    await page.click('text=⚡ Esquema Elétrico')
    await expect(page.locator('textarea[aria-label="Mensagem"]')).toBeVisible()
  })

  test('procedimento: manutenção preventiva split LG', async ({ page }) => {
    await page.goto('/chat')
    await page.fill('textarea[aria-label="Mensagem"]', 'Manutenção preventiva split LG 9000 BTU: checklist de limpeza e testes')
    await page.click('button[aria-label="Enviar mensagem"]')
    await page.waitForTimeout(700)
    await expect(page.getByText('ZapPRO IA').first()).toBeVisible()
  })

  test('validações: mensagens, alertas e tempos críticos', async ({ page }) => {
    await page.goto('/chat')
    await page.fill('textarea[aria-label="Mensagem"]', 'Sensor de temperatura evaporadora fora de faixa, como testar?')
    await page.click('button[aria-label="Enviar mensagem"]')
    const resp = await page.waitForResponse(/\/api\/openai\/chat/)
    const headers = resp.headers()
    const timing = headers['server-timing'] || headers['Server-Timing']
    expect(timing).toBeTruthy()
    await expect(page.locator('text=Digitando')).toHaveCount(0)
  })

  test('compatibilidade mobile em campo', async ({ browser }) => {
    test.skip(test.info().project.name === 'firefox', 'Firefox não suporta isMobile em newContext')
    const context = await browser.newContext({ ...devices['iPhone 12'], locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' })
    const page = await context.newPage()
    await page.goto('/chat')
    await expect(page.locator('textarea[aria-label="Mensagem"]')).toBeVisible()
    await context.close()
  })

  test('upload de imagem e documento', async ({ page }) => {
    await page.goto('/chat')
    const fileDoc = 'tests/fixtures/sample.txt'
    await page.setInputFiles('input[type="file"]', fileDoc)
    await page.click('button[aria-label="Enviar mensagem"]')
    await page.waitForTimeout(700)
    await expect(page.getByText('ZapPRO IA').first()).toBeVisible()
  })
})

