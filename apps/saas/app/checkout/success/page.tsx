'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isVerifying, setIsVerifying] = useState(true);
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const timer = setTimeout(() => { setIsVerifying(false); }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10">
                    <div className="text-center">
                        <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Verificando Pagamento...</h2>
                        <p className="text-gray-400">Aguarde enquanto confirmamos sua assinatura.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10">
                <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Pagamento Confirmado!</h1>
                    <p className="text-lg text-gray-300 mb-6">Bem-vindo ao <span className="text-emerald-400 font-bold">ZapPRO</span>! 🎉</p>
                    <div className="bg-black/20 rounded-xl p-6 mb-6 border border-white/5">
                        <p className="text-sm text-gray-400 mb-4">Sua assinatura foi ativada com sucesso. Agora você tem acesso total a:</p>
                        <ul className="text-left space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">✓</span><span>Consultas ilimitadas com IA especializada</span></li>
                            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">✓</span><span>Acesso a mais de 100 manuais técnicos</span></li>
                            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">✓</span><span>Histórico de conversas na nuvem</span></li>
                            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">✓</span><span>Suporte prioritário</span></li>
                        </ul>
                    </div>
                    <button onClick={() => router.push('/dashboard')} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/20">Acessar Dashboard</button>
                    {sessionId && (<p className="text-xs text-gray-600 mt-4">ID da sessão: {sessionId.slice(0, 20)}...</p>)}
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-6"><div className="text-white">Carregando...</div></div>}>
            <SuccessContent />
        </Suspense>
    )
}
