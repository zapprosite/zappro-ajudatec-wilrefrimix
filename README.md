<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ZapPRO – Assistente Técnico HVAC‑R (Next.js + OpenAI + Supabase + Stripe)

![CI Sprite](https://img.shields.io/badge/CI%20Sprite-ready-brightgreen)

## Arquitetura

- `apps/saas` (Next.js App Router)
  - UI: `components/WebLanding.tsx`, `components/ChatInterface.tsx`
  - API: `app/api/checkout`, `app/api/webhook/stripe`, `app/api/openai/*`
  - Libs: `lib/aiService.ts`, `lib/supabaseClient.ts`
  - Config: `next.config.ts` (`output: 'standalone'`)
- `supabase/`
  - `migrations/0001_init.sql` (perfis, assinaturas, chat_sessions, messages, attachments, usage_logs)
- `.trae/terminal.json` (contrato de execução WSL)
- `.github/workflows/scan.yml` (scan de container)

Nota: Todo o frontend antigo em Vite/Gemini foi removido. O projeto atual é somente Next.js em `apps/saas`.

## Requisitos

- Node.js 20+
- Conta Stripe (test mode e webhook)
- Projeto Supabase com Auth habilitado e provedores Google/GitHub configurados
- Vercel para deploy e variáveis de ambiente

## Configuração

1. Criar projeto Supabase e habilitar OAuth Google/GitHub
   - Coletar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Configurar Stripe
   - Criar produtos/preços e opcionalmente período de trial.
   - Coletar `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
   - Criar Pricing Table e coletar `NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID`.
3. Variáveis de ambiente (Vercel → Project Settings → Environment Variables)
   - `NEXT_PUBLIC_WEBSITE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`


## Dockerfile (Imagem mínima e segura)

- Base `node:20-alpine` com non-root user.
- Build multi-stage e execução com `next start`.
- Sem ferramentas supérfluas; camadas otimizadas.

## Scan de Container

- Pipeline de scan automatizado via GitHub Actions usando Trivy.
- Workflow em `.github/workflows/scan.yml` constrói a imagem `apps/saas` e executa análise de vulnerabilidades.

## Fluxos Principais

- Autenticação: Supabase OAuth (Google/GitHub) via botões na landing.
- Compra na landing: embed de Stripe Pricing Table e rota de checkout.
- Portal do cliente: link Stripe para gerenciamento de assinatura.

## Desenvolvimento Local (WSL 100%)

```bash
wsl bash -lc "cd /mnt/d/projetos/zappro-ajudatec-wilrefrimix/zappro-ajudatec-wilrefrimix/apps/saas && npm install && PORT=3001 npm run dev"
```

Abrir `http://localhost:3001`.



### Supabase Local (WSL)

- Pré-requisitos: Docker Desktop com integração WSL habilitada.
- Instalar CLI localmente no projeto e usar via `npx`.

```bash
wsl bash -lc "cd /mnt/d/projetos/zappro-ajudatec-wilrefrimix/zappro-ajudatec-wilrefrimix && npm i -D supabase && npx supabase --version"
wsl bash -lc "cd /mnt/d/projetos/zappro-ajudatec-wilrefrimix/zappro-ajudatec-wilrefrimix && npx supabase init"
wsl bash -lc "cd /mnt/d/projetos/zappro-ajudatec-wilrefrimix/zappro-ajudatec-wilrefrimix && npx supabase start"
wsl bash -lc "cd /mnt/d/projetos/zappro-ajudatec-wilrefrimix/zappro-ajudatec-wilrefrimix && npx supabase db reset"
```

- Após o `start`, copie `anon key` e `service_role key` para `apps/saas/.env`:
  - `NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon>`
  - `SUPABASE_SERVICE_ROLE_KEY=<service_role>`

### Rotas OpenAI (Next.js API)

- Chat, Transcribe e TTS expostas em `apps/saas/app/api/openai/*`.
- Configure `OPENAI_API_KEY` em `apps/saas/.env`.

## Foco do Projeto

- Especialista HVAC‑R brasileiro: diagnósticos práticos, leitura de manuais e suporte multimodal (texto, imagem, áudio, PDF) no estilo WhatsApp.
- UX orientada a campo: interação por teclado e acessibilidade WCAG 2.1 AA; animações respeitam `prefers-reduced-motion`.
- Observabilidade: `/status` com métricas, SSE de logs em `/api/logs/stream` e healthchecks.

## Plano de Uso de MCPs (Operação 2025)

- Postgrest
  - Quando usar: ler/escrever métricas/logs com RLS; consultar dados contratuais.
  - Como: cliente MCP PostgREST apontando para `rest` do compose.
  - Exemplo: `mcp_Postgrest_postgrestRequest({ method: 'GET', path: '/v1/items?select=*' })`.
- GitHub
  - Quando usar: abrir issues/PRs após falhas de CI, publicar artefatos.
  - Como: MCP GitHub para issues/PRs; branch `feature/*`/`fix/*` com checks verdes.
- Fetch/webresearch/Brave/Tavily
  - Quando usar: decisões com estado‑da‑arte (Next.js, Playwright, Docker, Supabase, WCAG).
  - Como: buscar documentação e síntese; citar fontes e registrar decisões.
- Persistent Knowledge Graph
  - Quando usar: mapear domínios HVAC‑R, requisitos e decisões de arquitetura.
  - Como: entidades `Subsistema`, `Manual`, `Decisão`; relações `depende_de`, `documentado_por`.
- Memory
  - Quando usar: preferências WSL (porta 3001), BASE_URL do compose, flags de CI.
  - Como: salvar `exec_env=WSL-Ubuntu-24.04` e `base_url=http://web:3001`.
- Sequential Thinking
  - Quando usar: tarefas com 3+ etapas (refatorações, migrações, pipelines).
  - Como: planejar passos e executar sequencialmente com validação em cada etapa.
- TaskManager (TodoWrite)
  - Quando usar: qualquer alteração multi‑arquivo; rastrear progresso e marcar concluído.
  - Como: item único in_progress por vez; estados `pending/in_progress/completed`.
- testsprite
  - Quando usar: pós‑deploy/produção; smoke de endpoints críticos (`/api/openai/*`, Stripe).
  - Como: `BASE_URL=http://localhost:3001 node apps/saas/scripts/sprite.mjs`.
- Playwright
  - Quando usar: UI crítica (landing/chat/upload/TTS/OAuth);
  - Como: via compose `tests` com `BASE_URL=http://web:3001`; rodar em produção (sem overlay dev).
- Firecrawl
  - Quando usar: indexar documentação externa para consulta offline.
  - Como: respeitar robots e licenças; armazenar apenas referência.

Referências
- Playwright em Docker e pins de versão: https://playwright.dev/docs/docker
- Execução headed e XServer/WSLg: https://www.oddbird.net/2022/11/30/headed-playwright-in-docker/

## Próximas Etapas

- Persistir eventos do Stripe em `public.subscriptions`
- Opcional: mover `app/api/openai/*` para `apps/api` dedicado
- Renomear funções legadas “Gemini” para nomenclatura neutra
- Checagem de plano ativo no frontend antes de liberar recursos PRO
## Padrões de Repositório (SaaS Next.js)

- App Router (`app/`) com páginas e funções de API em `app/api/*`.
- Separação client/server: chave OpenAI usada apenas em rotas do servidor.
- Camada `lib/` para serviços (OpenAI, Supabase) consumidos no client.
- UI componentizada em `components/` com estilização orientada a UX (WhatsApp‑like).
- Integração Stripe: `app/api/checkout` + embed Pricing Table na landing.
- Integração Supabase OAuth (Google/GitHub): `lib/supabaseClient.ts` e handlers.
- Build `output: 'standalone'` para contêiner leve.

## Rotas e Endpoints

- OpenAI
  - `POST /api/openai/chat` – gera resposta (multimodal: texto/imagem/pdf)
  - `POST /api/openai/transcribe` – transcreve áudio
  - `POST /api/openai/tts` – texto→fala, retorno Base64
- Stripe
  - `POST /api/checkout` – cria sessão de assinatura
  - `POST /api/webhook/stripe` – recebe eventos
- Páginas
  - `GET /` – landing com Pricing Table (quando configurado)
  - `GET /chat` – interface WhatsApp‑like
  - `GET /subscribe/success` – confirmação

## Variáveis de Ambiente (`apps/saas/.env`)

- `NEXT_PUBLIC_WEBSITE_URL` – base de navegação e redirects
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Opcional local: `NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321`

## Regras (Contrato Operacional)

- Executar sempre via WSL Ubuntu 24.04 com `wsl bash -lc "..."`.
- Validar `npm run lint`, `npm run typecheck`, `npm run build` em WSL.
- Não expor chaves em client; chamadas OpenAI somente pelo servidor.
- Portas padrão: dev `3000` (ou disponível), Stripe/Supabase conforme `config.toml`.
- Docker Desktop com integração WSL para Supabase local.
## Estrutura de Pastas

```
/
├─ apps/
│  └─ saas/              # Next.js: UI, APIs, Stripe, Supabase
│     ├─ app/api/checkout
│     ├─ app/api/webhook/stripe
│     ├─ app/api/openai/*
│     ├─ lib/supabaseClient.ts
│     ├─ next.config.ts  # standalone + tracing root
│     └─ Dockerfile
├─ supabase/
│  ├─ migrations/0001_init.sql
│  └─ config.toml
└─ README.md
```

## Desenvolvimento

```bash
wsl bash -lc "cd /mnt/d/projetos/zappro-ajudatec-wilrefrimix/zappro-ajudatec-wilrefrimix/apps/saas && npm install && PORT=3001 npm run dev"
```

Abrir `http://localhost:3001`.

## Desenvolvimento e Deploy
### Observabilidade de Build/CI

- Pipeline publica `sprite.json` e relatório HTML do Playwright como artefatos.
- Resumo com status e duração por endpoint é incluído no Job Summary.
