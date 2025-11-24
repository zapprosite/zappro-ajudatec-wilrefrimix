import { NextResponse } from 'next/server'
import { snapshot, validatePackages } from '../../../lib/monitor'
import pkg from '../../../package.json'

export async function GET(req: Request) {
  const t0 = Date.now()
  const allowed = process.env.ALLOWED_ORIGIN || process.env.NEXT_PUBLIC_WEBSITE_URL || ''
  const origin = req.headers.get('origin') || ''
  if (allowed && origin && origin !== allowed) {
    return NextResponse.json({ status: 'forbidden' }, { status: 403, headers: { 'Access-Control-Allow-Origin': allowed } })
  }
  const snap = snapshot()
  const deps: Record<string, string> = ((pkg as unknown as { dependencies?: Record<string, string> }).dependencies) || {}
  const versions = validatePackages(deps)
  const data = { ...snap, versions }
  const dur = Date.now() - t0
  const headers: Record<string, string> = { 'Access-Control-Allow-Origin': allowed, 'Server-Timing': `total;dur=${dur}` }
  return NextResponse.json(data, { status: 200, headers })
}

export async function OPTIONS() {
  const origin = (() => { try { return new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || '').origin } catch { return '' } })()
  return NextResponse.json({}, {
    status: 204,
    headers: {
      ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
