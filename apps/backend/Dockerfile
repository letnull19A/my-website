FROM node:24-alpine AS base

WORKDIR /app

RUN npm install -g pnpm@11

# Workspace manifests для кеша зависимостей
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN pnpm install --frozen-lockfile --filter backend --dangerously-allow-all-builds

# Копируем исходники backend
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

EXPOSE 4000

CMD ["node", "server.js"]
