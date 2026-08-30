# Stage 1: Build frontend (root context)
FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@11

# Root workspace manifests + lockfile for layer caching
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages ./packages
COPY apps/frontend/package.json ./apps/frontend/package.json

# Install deps for frontend (includes workspace packages)
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds 2>&1 | tail -n 20

# Copy frontend source
COPY apps/frontend ./apps/frontend

# Build args — baked into static export (output: export)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Build shared packages first, then frontend
RUN pnpm --filter @my-website/schemas build && \
    pnpm --filter @my-website/api build && \
    pnpm --filter frontend build && \
    npm uninstall -g pnpm && \
    npm cache clean --force && \
    rm -rf /root/.local/share/pnpm /root/.cache

# Stage 2: Ultra-minimal static server
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
