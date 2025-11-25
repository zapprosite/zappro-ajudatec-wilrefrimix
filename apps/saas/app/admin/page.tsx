import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminToken, getAdminUsername } from '@/lib/adminAuth'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('admin_session')?.value || ''
  const ok = cookie && verifyAdminToken(cookie)
  if (!ok) redirect('/admin/login')

  const user = getAdminUsername()

  return (
    <div className="min-h-screen bg-[#0f1115] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Área Administrativa</h1>
          <form action="/api/admin/logout" method="POST">
            <button className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400">Sair</button>
          </form>
        </div>
        <div className="rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-gray-800 to-gray-900">
          <p className="text-gray-300">Usuário autenticado: <span className="font-semibold text-white">{user}</span></p>
          <p className="text-gray-400 mt-2">Use esta área para tarefas administrativas.</p>
        </div>
      </div>
    </div>
  )
}
