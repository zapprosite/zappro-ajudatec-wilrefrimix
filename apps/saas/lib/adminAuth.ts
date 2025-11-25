import crypto from 'crypto'

type TokenPayload = { u: string; iat: number; exp: number }

const secret = process.env.ADMIN_SESSION_SECRET || 'dev-admin-secret'

function base64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export function createAdminToken(username: string, ttlSec = 12 * 60 * 60) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const payload: TokenPayload = { u: username, iat: now, exp: now + ttlSec }
  const payloadB64 = base64url(JSON.stringify(payload))
  const data = `${header}.${payloadB64}`
  const sig = base64url(crypto.createHmac('sha256', secret).update(data).digest())
  return `${data}.${sig}`
}

export function verifyAdminToken(token: string) {
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [header, payload, sig] = parts
  const expected = base64url(crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest())
  if (expected !== sig) return false
  try {
    const obj = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()) as TokenPayload
    const now = Math.floor(Date.now() / 1000)
    return typeof obj?.u === 'string' && now < obj.exp
  } catch {
    return false
  }
}

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME || 'admin'
}
