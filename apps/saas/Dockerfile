# Base mínima e oficial com versão explícita (Alpine) para reduzir superfície de ataque
ARG NODE_IMAGE=node:20.12.2-alpine3.20
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
# Instala certificados e dependências de build essenciais, sem cache
RUN apk add --no-cache ca-certificates && update-ca-certificates
# Usa package-lock para instalar versões fixas
COPY package.json package-lock.json* /app/
RUN npm ci
# Copia o projeto (contexto apps/saas) e realiza build em modo produção
COPY . /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner mínimo: apenas artefatos necessários, usuário não-root
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV TZ=UTC
LABEL org.opencontainers.image.title="ZapPRO SaaS" \
      org.opencontainers.image.description="Next.js app for HVAC-R assistant" \
      org.opencontainers.image.version="dev"
# Atualiza certificados para conexões TLS seguras
RUN apk add --no-cache ca-certificates tzdata && update-ca-certificates
# Copia o app standalone otimizado gerado pelo Next
COPY --from=builder --chown=node:node /app/.next/standalone /app
COPY --from=builder --chown=node:node /app/.next/static ./apps/saas/.next/static
# Define usuário não-root
USER node
EXPOSE 3001
# Healthcheck leve utilizando endpoint de health
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||'3001')+'/api/health', r=>{ if(r.statusCode!==200) process.exit(1) }).on('error',()=>process.exit(1))"
# Entrypoint
CMD ["node","app/server.js"]

# Estágio opcional de varredura com Trivy (usar com --target=scan)
FROM ghcr.io/aquasecurity/trivy:0.51.2 AS scan
# Copia o filesystem do runner para análise
COPY --from=runner / /imagefs
# Executa varredura de severidades altas/críticas; ajuste --exit-code conforme política
RUN trivy fs --no-progress --severity HIGH,CRITICAL --exit-code 0 /imagefs || true
