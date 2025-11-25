'use client';

import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>ZapPRO – Assistente Técnico HVAC-R</title>
        <meta name="description" content="Assistente técnico profissional HVAC-R com IA para o mercado brasileiro." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://js.stripe.com/v3/pricing-table.js" defer></script>
      </head>
      <body>
        <a href="#main" className="skip-link">Pular para o conteúdo</a>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
