'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/schemas';
import { useState } from 'react';

interface LoginFormProps {
    onSubmit: (data: LoginInput) => Promise<void>;
    onToggleMode: () => void;
}

export function LoginForm({ onSubmit, onToggleMode }: LoginFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const handleFormSubmit = async (data: LoginInput) => {
        setError('');
        setIsLoading(true);
        try {
            await onSubmit(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao fazer login';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                </label>
                <input
                    {...register('email')}
                    type="email"
                    id="email"
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Senha
                </label>
                <input
                    {...register('password')}
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                     text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500
                     transition-colors"
                    placeholder="••••••••"
                />
                {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                    <input
                        {...register('rememberMe')}
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-emerald-500 
                       focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-400">Lembrar-me</span>
                </label>
                <button
                    type="button"
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                    Esqueceu a senha?
                </button>
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
                        Entrando...
                    </span>
                ) : (
                    'Entrar'
                )}
            </button>

            {/* Toggle to Register */}
            <p className="text-center text-sm text-gray-400">
                Não tem uma conta?{' '}
                <button
                    type="button"
                    onClick={onToggleMode}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                    Criar conta
                </button>
            </p>
        </form>
    );
}
