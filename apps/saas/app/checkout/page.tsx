'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, session } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user || !session) {
            router.push('/');
            return;
        }

        const createCheckout = async () => {
            try {
                const response = await fetch('/api/stripe/create-checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({
                        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Erro ao criar checkout');
                }

                // Redirecionar para Stripe Checkout
                if (data.url) {
                    window.location.href = data.url;
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Erro ao processar pagamento';
                setError(message);
            }
        };

        createCheckout();
    }, [user, session, router]);

    if (error) {
        return (
            <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Erro no Checkout</h2>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all"
                        >
                            Voltar para Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Preparando Checkout...</h2>
                    <p className="text-gray-400">
                        Você será redirecionado para o Stripe em instantes.
                    </p>
                </div>
            </div>
        </div>
    );
}
