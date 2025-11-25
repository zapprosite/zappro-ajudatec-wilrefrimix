import './globals.css'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <script src="https://js.stripe.com/v3/pricing-table.js" defer></script>
      </head>
      <body>
        <a href="#main" className="skip-link">Pular para o conteúdo</a>
        {children}
      </body>
    </html>
  )
}
