# Tarefa de Navegação HVAC-R BR (Trae Preview + Playwright)

## Ambiente de Teste (WSL)

- Next dev/start na porta `3002` com CORS: `ALLOWED_ORIGIN=http://localhost:3002` e `NEXT_PUBLIC_WEBSITE_URL=http://localhost:3002`.
- Locale: `pt-BR`, Timezone: `America/Sao_Paulo`, Geolocalização: São Paulo/SP.
- Perfil técnico simulado via `localStorage`.

### Comandos

```bash
cd /mnt/d/projetos/zappro-ajudatec-wilrefrimix/zappro-ajudatec-wilrefrimix/apps/saas
# Instalação Playwright (se necessário)
npx playwright install --with-deps

# Dev Preview (Trae Preview) em 3002
ALLOWED_ORIGIN=http://localhost:3002 NEXT_PUBLIC_WEBSITE_URL=http://localhost:3002 ./node_modules/.bin/next dev -p 3002

# Alternativa produção local
npm run build
ALLOWED_ORIGIN=http://localhost:3002 NEXT_PUBLIC_WEBSITE_URL=http://localhost:3002 ./node_modules/.bin/next start -p 3002

# Testes HVAC-R BR
BASE_URL=http://localhost:3002 npm run test:e2e -- --grep "HVAC-R BR"
```

## Casos de Teste

- Perfil técnico e contexto BR: valida presença de "ZapPRO" e aplica perfil (CREA, marcas).
- Fluxo diagnóstico: erro 3 piscadas (Samsung Inverter), envio de mensagem e resposta.
- Erro comum: API não configurada (sem `OPENAI_API_KEY`).
- Interação com sistema: ação rápida "⚡ Esquema Elétrico".
- Manutenção preventiva: split LG 9000 BTU.
- Validações de performance: leitura de `Server-Timing`.
- Mobile: `iPhone 12` com `pt-BR`.
- Upload: documento `.txt` e verificação "PDF / DOC".

## Evidências de Execução

- Artefatos Playwright em `apps/saas/test-results/` (screenshots e traces quando habilitado).
- Logs de execução apresentados pelo runner.

## Cobertura de Cenários

- Marcas: Midea, Samsung, LG, Gree, Daikin.
- Cenários: 3 piscadas (Samsung), sensor evaporadora, IPM queimado, preventiva split.
- Dispositivos: desktop e iPhone 12.

## Análise de Desempenho

- Métrica principal: `Server-Timing` (duração total por requisição `/api/openai/chat`).
- Recomenda-se execução cíclica e cálculo de percentis (p50/p90/p95).

## Recomendações

- Fixar CORS em dev (`ALLOWED_ORIGIN` e `NEXT_PUBLIC_WEBSITE_URL`) para evitar 403.
- Habilitar `--trace on` no Playwright para inspeção de falhas.
- Adicionar `storageState` para simular login persistente no perfil técnico.
- Expandir fixture `hvac-br.json` com códigos de erro específicos por fabricante.

