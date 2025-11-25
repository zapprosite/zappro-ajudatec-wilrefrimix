'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginInput, RegisterInput } from '@/lib/schemas';
import AuthButtons from '../AuthButtons';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
    const { signIn, signUp } = useAuth();
    const router = useRouter()

    if (!isOpen) return null;

    const handleLogin = async (data: LoginInput) => {
        await signIn(data.email, data.password);
        onClose();
        router.push('/dashboard')
    };

    const handleRegister = async (data: RegisterInput) => {
        await signUp(data.email, data.password, data.name);
        onClose();
        router.push('/dashboard')
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-gradient-to-b from-gray-800 to-gray-900 
                      rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative p-6 border-b border-white/10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />

                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            {mode === 'login' ? 'Fazer Login' : 'Criar Conta'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            aria-label="Fechar"
                        >
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <p className="text-gray-400 mt-2">
                        {mode === 'login'
                            ? 'Entre para acessar sua conta'
                            : 'Crie sua conta e experimente grátis por 7 dias'}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {mode === 'login' ? (
                        <LoginForm
                            onSubmit={handleLogin}
                            onToggleMode={() => setMode('register')}
                        />
                    ) : (
                        <RegisterForm
                            onSubmit={handleRegister}
                            onToggleMode={() => setMode('login')}
                        />
                    )}
                    <div className="mt-6 flex justify-center">
                      <AuthButtons />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-black/20 border-t border-white/10">
                    <p className="text-xs text-gray-500 text-center">
                        Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
                    </p>
                </div>
            </div>
        </div>
    );
}
