import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const allowed = process.env.ALLOWED_ORIGIN || process.env.NEXT_PUBLIC_WEBSITE_URL || ''
  if (allowed) {
    res.headers.set('Access-Control-Allow-Origin', allowed)
    res.headers.set('Vary', 'Origin')
  }
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Referrer-Policy', 'no-referrer')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  return res
}

export const config = { matcher: ['/api/:path*'] }

