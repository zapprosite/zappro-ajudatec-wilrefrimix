'use client'

import { useState } from 'react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Falha na autenticação')
      window.location.assign('/admin')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha na autenticação'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-4">Login Administrativo</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="admin-user" className="block text-sm font-medium text-gray-300 mb-2">Usuário</label>
            <input id="admin-user" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="admin-pass" className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <input id="admin-pass" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white" />
          </div>
          {error && <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 disabled:opacity-50">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
