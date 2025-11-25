'use client'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function AuthButtons() {
  const { signIn, signOut } = useAuth()
  const fakeEmail = process.env.NEXT_PUBLIC_FAKE_AUTH_EMAIL || 'test@test.com'
  const fakePassword = process.env.NEXT_PUBLIC_FAKE_AUTH_PASSWORD || '12345678A'

  const signInGoogle = async () => {
    if (fakeEmail && fakePassword) {
      await signIn(fakeEmail, fakePassword)
      return
    }
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/` } })
  }

  const signInGithub = async () => {
    if (fakeEmail && fakePassword) {
      await signIn(fakeEmail, fakePassword)
      return
    }
    await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/` } })
  }

  const doSignOut = async () => {
    await signOut()
  }

  return (
    <div className="flex gap-3">
      <button className="px-4 py-2 bg-black text-white rounded" onClick={signInGoogle}>Entrar Google</button>
      <button className="px-4 py-2 bg-slate-800 text-white rounded" onClick={signInGithub}>Entrar GitHub</button>
      <button className="px-4 py-2 bg-slate-200 rounded" onClick={doSignOut}>Sair</button>
    </div>
  )
}
