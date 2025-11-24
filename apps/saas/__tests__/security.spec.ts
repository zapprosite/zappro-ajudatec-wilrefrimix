import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as logsStream from '../app/api/logs/stream/route'
import { attachClient, connections } from '../lib/monitor'
import * as stripeWebhook from '../app/api/webhook/stripe/route'

describe('Security routes', () => {
  let detachers: (() => void)[] = []

  beforeEach(() => {
    process.env.NEXT_PUBLIC_WEBSITE_URL = 'http://localhost:3001'
    process.env.ALLOWED_ORIGIN = ''
  })

  afterEach(() => {
    for (const d of detachers) d()
    detachers = []
    delete process.env.STRIPE_WEBHOOK_SECRET
  })

  it('rejects SSE with mismatched origin', async () => {
    const req = new Request('http://localhost:3001/api/logs/stream', { headers: { origin: 'https://evil.com' } })
    const res = await logsStream.GET(req)
    expect(res.status).toBe(403)
  })

  it('accepts SSE with allowed origin', async () => {
    const req = new Request('http://localhost:3001/api/logs/stream', { headers: { origin: 'http://localhost:3001' } })
    const res = await logsStream.GET(req)
    expect(res.status).toBe(200)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3001')
  })

  it('limits SSE connections', async () => {
    while (connections() < 100) {
      detachers.push(attachClient(() => {}))
    }
    const req = new Request('http://localhost:3001/api/logs/stream', { headers: { origin: 'http://localhost:3001' } })
    const res = await logsStream.GET(req)
    expect(res.status).toBe(429)
  })

  it('webhook returns 500 when secret missing', async () => {
    const req = new Request('http://localhost:3001/api/webhook/stripe', { method: 'POST', headers: { 'stripe-signature': '' }, body: 'test' })
    const res = await stripeWebhook.POST(req)
    expect(res.status).toBe(500)
  })
})

