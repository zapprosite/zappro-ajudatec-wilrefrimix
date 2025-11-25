# AGENTS – Contratos e Execução WSL (ZapPRO 2025)

## Princípios

- Execução 100% em WSL (Ubuntu 24.04/22.04).
- Porta dev padrão `3001` (canônica). Não alternar automaticamente. Usar `3002` apenas se explicitamente solicitado.
- Variáveis server‑only (`OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`) não podem ser expostas no cliente.

### Credenciais de teste (Fake Auth)

- Email: `test@test.com`
- Senha: `12345678A`
- Ative em preview/dev com:

```bash
NEXT_PUBLIC_FAKE_AUTH_EMAIL=test@test.com
NEXT_PUBLIC_FAKE_AUTH_PASSWORD=12345678A
```

Fluxo: Landing → `Fazer Login` → preencher credenciais → `Testar Grátis` → `\dashboard`.

## Scripts e Organização

- `.sh` na raiz (WSL): `wsl-commands.sh`, `test-run-wsl.sh`, `test-build-wsl.sh`.
- Não há scripts PowerShell próprios no repositório; arquivos `.ps1` detectados estão em `node_modules` (Playwright) e não são alterados.
- Comandos padronizados:
  - Dev 3001: `wsl bash -lc "cd /mnt/d/.../apps/saas && PORT=3001 npm run dev"`
  - Tests E2E em WSL (porta canônica): `BASE_URL=http://localhost:3001 npm run test:e2e -- tests/*.spec.ts`
  - Build: `wsl bash -lc "cd /mnt/d/.../apps/saas && npm run typecheck && npm run build"`
  - Compose tests: `docker compose run --rm --profile test -e BASE_URL=http://web:3001 tests`

## Containers

- `apps/saas/Dockerfile`: imagem Alpine, usuário não‑root, labels OCI, healthcheck e estágio Trivy.
- `docker-compose.yml`: `web` (3001), `rest` (3000), `studio` (3006), `SUPABASE_URL=http://kong:8000` (rede docker), booleans como strings.

## Variáveis de Ambiente

- Referência: `apps/saas/.env.example`.
- Uso do prompt padrão: `SYSTEM_INSTRUCTION_PT_BR_PATH=prompts/system-instruction.pt-br.md`.
- Alternativa inline: `SYSTEM_INSTRUCTION_PT_BR=` com conteúdo direto.

## Segurança

- Não expor chaves server‑only em `NEXT_PUBLIC_*`.
- CORS coerente via `ALLOWED_ORIGIN` com origem efetiva (3001/3002).
- Executar varreduras Trivy em CI para vulnerabilidades (HIGH, CRITICAL).

## Mudanças Realizadas

- Ajustes no Compose (portas e booleans).
- Dockerfile com labels OCI, `TZ=UTC` e `COPY --chown`.
- `.env.example` reestruturado com comentários, seções e exemplos.
- Prompt padrão criado em `apps/saas/prompts/system-instruction.pt-br.md` e chave `SYSTEM_INSTRUCTION_PT_BR_PATH` adicionada.
