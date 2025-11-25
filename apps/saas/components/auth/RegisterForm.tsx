'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/schemas';
import { useState } from 'react';

interface RegisterFormProps {
    onSubmit: (data: RegisterInput) => Promise<void>;
    onToggleMode: () => void;
}

export function RegisterForm({ onSubmit, onToggleMode }: RegisterFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const handleFormSubmit = async (data: RegisterInput) => {
        setError('');
        setIsLoading(true);
        try {
            await onSubmit(data);
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Nome completo
                </label>
                <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                     text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500
                     transition-colors"
                    placeholder="João Silva"
                />
                {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                </label>
                <input
                    {...register('email')}
                    type="email"
                    id="reg-email"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                     text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500
                     transition-colors"
                    placeholder="seu@email.com"
                />
                {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-gray-300 mb-2">
                    Senha
                </label>
                <input
                    {...register('password')}
                    type="password"
                    id="reg-password"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                     text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500
                     transition-colors"
                    placeholder="••••••••"
                />
                {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar senha
                </label>
                <input
                    {...register('confirmPassword')}
                    type="password"
                    id="confirmPassword"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                     text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500
                     transition-colors"
                    placeholder="••••••••"
                />
                {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
            </div>

            {/* Terms */}
            <div>
                <label className="flex items-start gap-3">
                    <input
                        {...register('termsAccepted')}
                        type="checkbox"
                        className="w-4 h-4 mt-1 rounded border-gray-700 bg-gray-800 text-emerald-500 
                       focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-400">
                        Aceito os{' '}
                        <a href="/termos" className="text-emerald-400 hover:text-emerald-300">
                            termos de uso
                        </a>{' '}
                        e a{' '}
                        <a href="/privacidade" className="text-emerald-400 hover:text-emerald-300">
                            política de privacidade
                        </a>
                    </span>
                </label>
                {errors.termsAccepted && (
                    <p className="text-red-400 text-sm mt-1">{errors.termsAccepted.message}</p>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-bold text-lg
                   bg-gradient-to-r from-emerald-500 to-cyan-500
                   hover:from-emerald-600 hover:to-cyan-600
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Criando conta...
                    </span>
                ) : (
                    'Criar conta'
                )}
            </button>

            {/* Toggle to Login */}
            <p className="text-center text-sm text-gray-400">
                Já tem uma conta?{' '}
                <button
                    type="button"
                    onClick={onToggleMode}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                    Fazer login
                </button>
            </p>
        </form>
    );
}
