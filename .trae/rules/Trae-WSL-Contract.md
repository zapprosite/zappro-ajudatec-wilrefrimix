# Contrato Técnico – Execução Consistente em WSL (Trae IDE)

Versão: 1.0
Data de implementação obrigatória: 25/11/2025

## 1. Regras Obrigatórias
- Primeira regra: todos os terminais e servidores operam exclusivamente em WSL (Windows Subsystem for Linux).
- Configuração mínima:
  - Windows 11 com WSL 2 habilitado e systemd ativo
  - Distribuição: Ubuntu 24.04 LTS (recomendado) ou 22.04 LTS (suportado)
  - Docker Desktop com integração WSL habilitada
  - Node.js 20+ e npm 10+
  - Git e OpenSSL instalados no WSL
- Versões suportadas de WSL:
  - WSL 2.x: Suportado e recomendado
  - WSL 1.x: Não suportado

## 2. Especificações Técnicas
- Configuração de terminais:
  - Shell padrão: `bash` (zsh opcional)
  - Locale UTF‑8 e timezone configurados (`/etc/default/locale`, `timedatectl`)
  - Caminhos Linux sempre em `/mnt/<drive>/...`, nunca paths Windows
- Gerenciamento de servidores:
  - Next.js, Node, Supabase e serviços auxiliares devem ser iniciados via `wsl bash -lc "..."`
  - Portas padronizadas: app dev `3001` (canônica e estável). Não alternar portas automaticamente. A porta `3002` só deve ser usada mediante solicitação explícita.
  - Controle de portas/processos com `ss`, `lsof`, `ps`, `kill`
- Protocolos de comunicação:
  - HTTP local entre componentes (client → API em `app/api/*`)
  - Webhooks (Stripe) expostos via rotas Next.js
  - Comunicação com OpenAI feita exclusivamente no servidor (sem chaves em client)

## 3. Implementação
- Scripts de inicialização WSL (modelo):
  - Dev: `wsl bash -lc "cd /mnt/d/.../apps/saas && PORT=3001 npm run dev"` (sempre em `3001`)
  - Produção local: `wsl bash -lc "cd /mnt/d/.../apps/saas && npm run build && PORT=3001 npm run start"`
  - Supabase: `wsl bash -lc "cd /mnt/d/... && npx supabase start"` (Docker ativo)
- Variáveis de ambiente:
  - Armazenadas em `apps/saas/.env` (sem exposição em client)
  - Chaves: `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, etc. apenas usadas em rotas server
  - Credenciais de teste (Fake Auth) para dev/preview (em `3001`):
    - `NEXT_PUBLIC_FAKE_AUTH_EMAIL=test@test.com`
    - `NEXT_PUBLIC_FAKE_AUTH_PASSWORD=12345678A`
    - Fluxo: Landing → `Fazer Login` → `Testar Grátis` → `\dashboard`
    - BASE_URL para testes E2E em WSL: `http://localhost:3001`
  - Seed de login:
    - Fake auth não requer seed de banco; a sessão é persistida em `localStorage` (`fake_auth_session`) após o login.
    - Padronizar execução do servidor e dos testes via WSL para consistência.
- Registro de Conversões (Windows → WSL Ubuntu 24.04):
- Terminal VS Code padronizado: `WSL: Ubuntu-24.04`.
- Scripts `dev/build/preview/install` no `package.json` (raiz e `apps/saas`) migrados para `wsl bash -lc` com paths `/mnt/d/...`.
- Playwright configurado para iniciar `next dev` via WSL com `reuseExistingServer` e envs fixos; base URL `http://localhost:3001`.
- `AuthButtons.tsx` atualizado com fallback fake auth; integrado ao `AuthModal` para visibilidade consistente.
- Ajustes de CORS via `middleware.ts` alinhados ao preview em WSL.

Justificativas Técnicas:
- Uniformização de shell e paths elimina diferenças de semântica entre PowerShell/cmd e Bash.
- Porta canônica `3001` reduz conflitos e simplifica testes/cobertura.
- Fallback fake auth permite desenvolvimento e testes sem provedores externos.
- CORS parametrizado garante segurança e repetibilidade em dev.

Registro de Compatibilidade (WSL 24.04):
- `wsl.exe --version` ≥ 2.x e `Ubuntu 24.04` suportados.
- Testes E2E validados: login/modal, OAuth fallback e chat.
- `npm run lint` e `npm run typecheck` verdes em WSL.
- Monitoramento de performance:
  - `htop`, `top`, `free -h`, `docker stats` no WSL
  - Logs de Next.js (dev e produção), métricas de latência de rotas (adicionar quando necessário)

## 4. Validação
- Testes de conformidade:
  - `wsl bash -lc "cd /mnt/d/.../apps/saas && npm run lint && npm run typecheck && npm run build"`
  - Smoke E2E: `wsl bash -lc "cd /mnt/d/.../apps/saas && BASE_URL=http://localhost:3001 node scripts/sprite.mjs"`
  - E2E Playwright (compose): `docker compose run --rm --profile test tests`
- Verificação de compatibilidade:
  - `wsl.exe --version` (2.x), `cat /etc/os-release` (Ubuntu 24.04/22.04), `docker info`
- Logs e métricas:
  - Registrar status HTTP e tempos de resposta dos endpoints críticos (`/api/openai/*`, `/api/checkout`, webhooks)

### Git Workflow (WSL)
- Operações Git (commit/push/tag) realizadas a partir do WSL
- Branches: `main` protegido; `feature/*`, `fix/*`, `release/*`, `hotfix/*`
- Tags: `vMAJOR.MINOR.PATCH` criadas após validação local (`lint/typecheck/build/test:e2e`)
- CI em GitHub valida contrato WSL (compose `web` em `3001`, testsprite/Playwright via `tests`)

## 5. Versionamento e Retrocompatibilidade
- Esta documentação é versionada neste repositório, com atualização obrigatória quando novas versões do WSL forem lançadas.
- Manter retrocompatibilidade com ambientes WSL existentes (22.04/24.04), incluindo notas de migração.
## 6. Execução por Docker Compose (WSL)
- Subir web: `docker compose up -d web && curl -sf http://localhost:3001/`
- Testes E2E: `docker compose run --rm --profile test tests`
- Down: `docker compose down -v --remove-orphans`
