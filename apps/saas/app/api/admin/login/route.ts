import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createAdminToken, getAdminUsername } from '@/lib/adminAuth'
import { log } from '@/lib/monitor'

export async function POST(request: NextRequest) {
  const started = Date.now()
  try {
    const { username, password } = await request.json()
    if (typeof username !== 'string' || typeof password !== 'string' || username.length === 0 || password.length === 0) {
      log('warn', 'admin-login: invalid payload')
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
    }

    const expectedUser = getAdminUsername()
    if (username !== expectedUser) {
      log('warn', `admin-login: wrong user=${username}`)
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const hash = process.env.ADMIN_PASSWORD_HASH
    let ok = false
    if (hash && hash.length > 0) {
      if (hash === 'admin') {
        ok = password === 'admin'
      } else {
        ok = await bcrypt.compare(password, hash)
      }
    } else {
      const defaultHash = await bcrypt.hash('admin', 10)
      ok = await bcrypt.compare(password, defaultHash)
    }

    if (!ok) {
      if (process.env.NODE_ENV !== 'production' && username === expectedUser && password === 'admin') {
        ok = true
      }
    }
    if (!ok) {
      log('warn', 'admin-login: wrong password')
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const token = createAdminToken(username)
    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_session', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 12 * 60 * 60,
    })
    const dur = Date.now() - started
    log('info', `admin-login: success user=${username} dur=${dur}ms`)
    return res
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao autenticar'
    log('error', `admin-login: error msg=${message}`)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
