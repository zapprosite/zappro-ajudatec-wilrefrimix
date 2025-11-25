import { NextResponse } from 'next/server'
import { log } from '@/lib/monitor'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_session', '', { httpOnly: true, path: '/', maxAge: 0, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' })
  log('info', 'admin-logout: success')
  return res
}
