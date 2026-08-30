# Stage 1: Build frontend
FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@11

# Workspace manifests — кешируются отдельным слоем
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY apps/backend/package.json ./apps/backend/package.json

RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

# Копируем весь контекст (фильтруется .dockerignore)
COPY . .

RUN pnpm --filter frontend build && \
    npm uninstall -g pnpm && \
    npm cache clean --force && \
    rm -rf node_modules /root/.local/share/pnpm /root/.cache

# Stage 2: Ultra-minimal static server (~150KB base)
FROM joseluisq/static-web-server:2-debian

WORKDIR /

COPY --from=builder /app/apps/frontend/out /app
COPY --from=builder /app/apps/frontend/public /app

ENV PORT=3000
ENV SERVER_PORT=${PORT}
ENV SERVER_ROOT=/app
ENV SERVER_HEALTH=true
ENV SERVER_FALLBACK_PAGE=/app/index.html
ENV SERVER_IGNORE_HIDDEN_FILES=true

EXPOSE ${PORT}
