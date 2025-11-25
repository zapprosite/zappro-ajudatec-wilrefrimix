'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const fakeEmail = process.env.NEXT_PUBLIC_FAKE_AUTH_EMAIL || 'test@test.com'
  const fakePassword = process.env.NEXT_PUBLIC_FAKE_AUTH_PASSWORD || '12345678A'

  useEffect(() => {
    const init = async () => {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('fake_auth_session') : null
      if (fakeEmail && fakePassword && stored) {
        try {
          const parsed = JSON.parse(stored)
          setUser(parsed.user as unknown as User)
          setSession(parsed.session as unknown as Session)
          setLoading(false)
          return
        } catch {}
      }
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s)
        setUser(s?.user ?? null)
      })
      return () => subscription.unsubscribe()
    }
    init()
  }, [])

    const signIn = async (email: string, password: string) => {
        if (fakeEmail && fakePassword && email === fakeEmail && password === fakePassword) {
            const fakeUser = { id: 'fake-user', email, user_metadata: { name: 'Usuário Teste' } }
            const fakeSession = { access_token: 'fake-token', token_type: 'bearer', expires_in: 3600 } as unknown as Session
            setUser(fakeUser as unknown as User)
            setSession(fakeSession)
            if (typeof window !== 'undefined') window.localStorage.setItem('fake_auth_session', JSON.stringify({ user: fakeUser, session: fakeSession }))
            return
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
    };

    const signUp = async (email: string, password: string, name: string) => {
        if (fakeEmail && fakePassword && email === fakeEmail && password === fakePassword) {
            const fakeUser = { id: 'fake-user', email, user_metadata: { name } }
            const fakeSession = { access_token: 'fake-token', token_type: 'bearer', expires_in: 3600 } as unknown as Session
            setUser(fakeUser as unknown as User)
            setSession(fakeSession)
            if (typeof window !== 'undefined') window.localStorage.setItem('fake_auth_session', JSON.stringify({ user: fakeUser, session: fakeSession }))
            return
        }
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
        if (error) throw error
    };

    const signOut = async () => {
        if (typeof window !== 'undefined') window.localStorage.removeItem('fake_auth_session')
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null)
        setSession(null)
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                signIn,
                signUp,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
