# ZapPRO – Assistente Técnico HVAC-R Profissional

![CI Sprite](https://img.shields.io/badge/CI%20Sprite-ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Auth](https://img.shields.io/badge/Auth-Supabase-green)
![Payments](https://img.shields.io/badge/Payments-Stripe-purple)

> Sistema profissional de assistência técnica para HVAC-R com IA, autenticação real Supabase e pagamentos Stripe.

---

## 🏗️ Arquitetura

### Stack Tecnológico

- **Frontend**: Next.js 15 (App Router) + React + TypeScript
- **Autenticação**: Supabase Auth (OAuth Google/GitHub + Email/Password)
- **Database**: Supabase PostgreSQL com Row Level Security (RLS)
- **Pagamentos**: Stripe (Checkout + Webhooks)
- **IA**: OpenAI GPT-4 (Chat, Transcribe, TTS)
- **Validação**: Zod + React Hook Form
- **Styling**: Tailwind CSS + Glassmorphism
- **Testing**: Playwright (E2E) + Vitest
- **Deploy**: Vercel / Docker

---

## 📁 Estrutura Completa do Projeto

```
zappro-ajudatec-wilrefrimix/
├── apps/
│   └── saas/                           # Aplicação Next.js principal
│       ├── app/                        # App Router (Next.js 15)
│       │   ├── api/                    # API Routes
│       │   │   ├── openai/             # Rotas OpenAI
│       │   │   │   ├── chat/
│       │   │   │   │   └── route.ts    # ✅ Chat com IA (corrigido)
│       │   │   │   ├── transcribe/
│       │   │   │   │   └── route.ts    # Transcribe áudio
│       │   │   │   └── tts/
│       │   │   │       └── route.ts    # Text-to-Speech
│       │   │   ├── stripe/             # Rotas Stripe
│       │   │   │   └── create-checkout/
│       │   │   │       └── route.ts    # ✅ Criar sessão checkout
│       │   │   ├── webhook/
│       │   │   │   └── stripe/
│       │   │   │       └── route.ts    # ✅ Webhook Stripe (implementado)
│       │   │   └── logs/
│       │   │       └── stream/
│       │   │           └── route.ts    # SSE logs
│       │   ├── chat/
│       │   │   └── page.tsx            # Interface de chat WhatsApp-like
│       │   ├── checkout/               # ✅ Fluxo de checkout
│       │   │   ├── page.tsx            # Página de checkout (redirect)
│       │   │   ├── success/
│       │   │   │   └── page.tsx        # Confirmação de pagamento
│       │   │   └── cancel/
│       │   │       └── page.tsx        # Cancelamento
│       │   ├── dashboard/              # ✅ Dashboard protegido
│       │   │   └── page.tsx            # Dashboard do usuário
│       │   ├── status/
│       │   │   └── page.tsx            # Health check + métricas
│       │   ├── subscribe/
│       │   │   └── success/
│       │   │       └── page.tsx        # Success page (legacy)
│       │   ├── layout.tsx              # ✅ Layout global com AuthProvider
│       │   ├── page.tsx                # Landing page
│       │   └── globals.css             # Estilos globais
│       ├── components/                 # Componentes React
│       │   ├── auth/                   # ✅ Sistema de autenticação
│       │   │   ├── AuthModal.tsx       # Modal login/registro
│       │   │   ├── LoginForm.tsx       # Formulário de login
│       │   │   └── RegisterForm.tsx    # Formulário de registro
│       │   ├── ChatInterface.tsx       # Interface de chat
│       │   └── WebLanding.tsx          # ✅ Landing page refatorada
│       ├── contexts/                   # ✅ Contextos React
│       │   └── AuthContext.tsx         # Contexto de autenticação global
│       ├── lib/                        # Bibliotecas e utilitários
│       │   ├── schemas.ts              # ✅ Schemas Zod de validação
│       │   ├── supabase.ts             # ✅ Cliente Supabase singleton
│       │   ├── supabaseClient.ts       # Cliente Supabase (legacy)
│       │   └── aiService.ts            # Serviços de IA
│       ├── scripts/                    # Scripts utilitários
│       │   ├── embed-text.mjs          # Embeddings de texto
│       │   ├── extract-pdf.mjs         # Extração de PDFs
│       │   ├── search.mjs              # Busca vetorial
│       │   ├── sprite.mjs              # Health checks automatizados
│       │   └── upload-manual.mjs       # Upload de manuais
│       ├── tests/                      # Testes E2E Playwright
│       │   ├── chat.spec.ts            # Testes da interface de chat
│       │   ├── landing.spec.ts         # Testes da landing page
│       │   ├── oauth-flow.spec.ts      # Testes de OAuth
│       │   ├── subscription.spec.ts    # Testes de assinatura
│       │   ├── tts.spec.ts             # Testes de TTS
│       │   └── upload.spec.ts          # Testes de upload
│       ├── types.ts                    # ✅ Tipos TypeScript (isError added)
│       ├── constants.ts                # Constantes (preços, etc)
│       ├── middleware.ts               # Middleware Next.js
│       ├── next.config.ts              # Configuração Next.js
│       ├── tailwind.config.ts          # Configuração Tailwind
│       ├── tsconfig.json               # ✅ Config TypeScript (paths @/*)
│       ├── playwright.config.ts        # Config Playwright
│       ├── vitest.config.ts            # Config Vitest
│       ├── .env                        # Variáveis de ambiente (gitignored)
│       ├── .env.example                # Template de variáveis
│       ├── package.json                # Dependências
│       └── Dockerfile                  # Container multi-stage
├── supabase/                           # Configuração Supabase
│   ├── migrations/                     # Migrações SQL
│   │   ├── 0001_init.sql               # Schema inicial
│   │   └── 0002_restrict_logs.sql      # ✅ RLS para logs
│   └── config.toml                     # Config Supabase local
├── .trae/                              # Regras de desenvolvimento
│   ├── terminal.json                   # Contrato WSL
│   └── rules/
│       └── Trae-WSL-Contract.md        # Contrato de execução
├── .github/
│   └── workflows/
│       └── scan.yml                    # CI/CD + Container scan
├── CHANGELOG.md                        # ✅ Changelog detalhado
├── TESTING.md                          # ✅ Guia de testes
├── README-FIXES.md                     # ✅ Resumo de fixes
└── README.md                           # Este arquivo
```

---

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação (Supabase Auth)

- ✅ Login com email/senha
- ✅ Registro com validação forte (Zod)
- ✅ OAuth Google/GitHub (configurável)
- ✅ Sessão persistente (httpOnly cookies)
- ✅ Logout
- ✅ Protected routes
- ✅ AuthContext global (React Context API)

### 💳 Pagamentos (Stripe)

- ✅ Checkout Session com Stripe real (test mode)
- ✅ Webhook para processar eventos de assinatura
- ✅ Páginas de success/cancel
- ✅ Integração com Supabase (user_id metadata)
- ✅ Atualização automática de `subscriptions` table
- ✅ Suporte a trial periods

### 💬 Chat com IA (OpenAI)

- ✅ Interface WhatsApp-like
- ✅ Multimodal: texto, imagens, PDFs, áudio
- ✅ Transcribe (Whisper)
- ✅ Text-to-Speech (TTS)
- ✅ Histórico persistente (Supabase)
- ✅ Retry em caso de erro
- ✅ Rate limiting

### 📊 Dashboard

- ✅ Página protegida (auth required)
- ✅ Status de assinatura
- ✅ Informações do usuário
- ✅ Quick actions
- ✅ Logout button

### 🎨 UI/UX

- ✅ Dark theme com glassmorphism
- ✅ Responsive design (mobile-first)
- ✅ Animações suaves
- ✅ Acessibilidade WCAG AA
- ✅ Loading states
- ✅ Error handling

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+
- Docker Desktop (para Supabase local)
- WSL Ubuntu 24.04 (Windows)
- Conta Stripe (test mode)
- Projeto Supabase

### 1. Instalação

```bash
# Clonar repositório
git clone <repo-url>
cd zappro-ajudatec-wilrefrimix

# Instalar dependências (via WSL)
wsl bash -lc "cd /mnt/d/projetos/zappro-ajudatec-wilrefrimix/zappro-ajudatec-wilrefrimix/apps/saas && npm install"
```

### 2. Configurar Variáveis de Ambiente

Copiar `.env.example` para `.env` e preencher:

```bash
# Next.js
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# OpenAI
OPENAI_API_KEY=sk-xxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID=prctbl_xxx
```

### 3. Iniciar Supabase Local

```bash
wsl bash -lc "cd /mnt/d/projetos/zappro-ajudatec-wilrefrimix/zappro-ajudatec-wilrefrimix && npx supabase start"
```

Copiar as keys exibidas para `.env`.

### 4. Rodar Dev Server

```bash
wsl bash -lc "cd /mnt/d/projetos/zappro-ajudatec-wilrefrimix/zappro-ajudatec-wilrefrimix/apps/saas && PORT=3001 npm run dev"
```

Abrir: **http://localhost:3001**

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Dev server (porta 3001)
npm run build            # Build para produção
npm run start            # Start produção
npm run lint             # ESLint
npm run typecheck        # TypeScript check

# Testes
npm run test             # Vitest unit tests
npm run test:e2e         # Playwright E2E
npm run test:e2e:ui      # Playwright UI mode

# Supabase
npx supabase start       # Iniciar local
npx supabase stop        # Parar containers
npx supabase db reset    # Reset + migrations
npx supabase status      # Ver status
```

---

## 🧪 Como Testar

### Autenticação

1. Abrir `http://localhost:3001`
2. Clicar em **"Testar Grátis"**
3. Preencher formulário de registro
4. Verificar redirect para `/dashboard`
5. Testar logout

### Checkout Stripe

1. No dashboard, clicar **"Assinar"**
2. Aguardar redirect para `/checkout`
3. Será redirecionado para Stripe Checkout
4. Usar cartão de teste: `4242 4242 4242 4242`
   - CVC: qualquer 3 dígitos
   - Data: qualquer futura
5. Confirmar pagamento
6. Verificar redirect para `/checkout/success`

### Chat

1. Autenticar
2. Navegar para `/chat`
3. Enviar mensagem de texto
4. Testar upload de imagem
5. Testar áudio (se disponível)

---

## 🔒 Segurança

### Implementado

- ✅ Row Level Security (RLS) no Supabase
- ✅ API keys apenas no servidor (Next.js API routes)
- ✅ Validação de input com Zod
- ✅ CSRF protection (Next.js)
- ✅ Webhook signature verification (Stripe)
- ✅ httpOnly cookies (Supabase Auth)
- ✅ Non-root user no Docker
- ✅ Container scanning (Trivy)

### Logs Protegidos

```sql
-- RLS policy para logs (apenas service_role)
ALTER TABLE openai_api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhook_logs ENABLE ROW LEVEL SECURITY;
-- Nenhuma policy = apenas service_role tem acesso
```

---

## 📊 Observabilidade

### Health Check

```bash
curl http://localhost:3001/status
```

Retorna:
- Status da API
- Versão
- Métricas de uso

### Logs Stream (SSE)

```bash
curl http://localhost:3001/api/logs/stream
```

### Sprite (Smoke Tests)

```bash
BASE_URL=http://localhost:3001 node apps/saas/scripts/sprite.mjs
```

---

## 🐳 Docker

### Build

```bash
docker build -t zappro-saas -f apps/saas/Dockerfile apps/saas
```

### Run

```bash
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e OPENAI_API_KEY=... \
  zappro-saas
```

---

## 🚀 Deploy (Vercel)

### 1. Conectar Repositório

1. Importar projeto no Vercel
2. Selecionar `apps/saas` como root directory

### 2. Configurar Environment Variables

Adicionar todas as variáveis de `.env` no painel do Vercel.

### 3. Deploy

```bash
vercel --prod
```

### 4. Configurar Webhook Stripe

1. Criar endpoint no Stripe Dashboard
2. URL: `https://seu-app.vercel.app/api/webhook/stripe`
3. Eventos: `customer.subscription.*`
4. Copiar signing secret para `STRIPE_WEBHOOK_SECRET`

---

## 📚 Documentação Adicional

- [CHANGELOG.md](./CHANGELOG.md) - Histórico de mudanças
- [TESTING.md](./TESTING.md) - Guia completo de testes
- [README-FIXES.md](./README-FIXES.md) - Resumo de correções críticas
- [.trae/rules/Trae-WSL-Contract.md](./.trae/rules/Trae-WSL-Contract.md) - Contrato de desenvolvimento

---

## 🛠️ Tecnologias e Versões

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 15.5.6 | Framework React |
| React | 18+ | UI Library |
| TypeScript | 5.x | Type safety |
| Supabase | Latest | Auth + Database |
| Stripe | Latest (API 2024-06-20) | Payments |
| OpenAI | Latest | IA (GPT-4) |
| Zod | 3.x | Validation |
| React Hook Form | 7.x | Forms |
| Lucide React | Latest | Icons |
| Tailwind CSS | 3.x | Styling |
| Playwright | Latest | E2E Testing |
| Vitest | Latest | Unit Testing |

---

## 🤝 Contribuindo

1. Fork o projeto
2. Criar branch (`git checkout -b feature/amazing`)
3. Commit mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Abrir Pull Request

---

## 📄 Licença

Proprietary - Todos os direitos reservados © 2025 ZapPRO

---

## 🎯 Roadmap

### Em Desenvolvimento
- [ ] Middleware de autenticação Next.js
- [ ] Integração com WebLanding (AuthModal)
- [ ] Testes E2E completos
- [ ] Cache de respostas IA
- [ ] Upload de manuais PDF

### Planejado
- [ ] App mobile (React Native)
- [ ] Notificações push
- [ ] Analytics dashboard
- [ ] Multi-idioma (i18n)
- [ ] Modo offline

---

**Feito com ❤️ para técnicos HVAC-R brasileiros**

[Website](https://zappro.com.br) • [Documentação](./docs) • [Status](https://status.zappro.com.br)
