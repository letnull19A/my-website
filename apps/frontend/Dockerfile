# Stage 1: Build frontend (SSR, standalone) — supports both repo root and apps/frontend as build context
FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git && npm install -g pnpm@11

COPY . /tmp/context

ARG GIT_REPO=https://github.com/letnull19A/my-website.git
ARG GIT_REF=""
# Baked into the client bundle at build time (NEXT_PUBLIC_* are inlined by Next.js).
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ARG NEXT_PUBLIC_SITE_URL=https://letnull19a.github.io/my-website
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

RUN set -e; \
    if [ -f /tmp/context/pnpm-workspace.yaml ]; then \
      echo "[builder] Root context detected — using it"; \
      cp -a /tmp/context/. /app/ 2>/dev/null || cp -a /tmp/context/* /app/ 2>/dev/null || true; \
    else \
      if [ -n "$GIT_REF" ]; then \
        echo "[builder] App context detected — cloning $GIT_REPO branch $GIT_REF"; \
        rm -rf /tmp/repo && \
        git clone --depth 1 --branch "$GIT_REF" "$GIT_REPO" /tmp/repo 2>&1 || \
          (echo "[builder] Branch $GIT_REF not found, cloning default branch" && rm -rf /tmp/repo && git clone --depth 1 "$GIT_REPO" /tmp/repo); \
      else \
        echo "[builder] App context detected — cloning $GIT_REPO default branch"; \
        rm -rf /tmp/repo && git clone --depth 1 "$GIT_REPO" /tmp/repo; \
      fi; \
      cp -a /tmp/repo/. /app/ 2>/dev/null || cp -a /tmp/repo/* /app/ 2>/dev/null || true; \
      echo "[builder] Cloned repo to /app"; \
      ls -la /app | head -n 20; \
    fi; \
    ls -la /app/pnpm-workspace.yaml /app/packages 2>&1 | head -n 20; \
    test -f /app/pnpm-workspace.yaml || (echo "ERROR: pnpm-workspace.yaml not found. Ensure Docker build context is repository root (docker build -f apps/frontend/Dockerfile .) . In Dokploy set Build Context to '.' and Dockerfile to 'apps/frontend/Dockerfile'. You can also set GIT_REF build-arg to the branch to clone for app-context fallback." && exit 1)

RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds 2>&1 | tail -n 20

RUN pnpm --filter @my-website/schemas build && \
    pnpm --filter @my-website/api build && \
    # webpack-сборка вместо Turbopack по умолчанию: ей нужно в разы меньше
    # RAM (Turbopack требует >1.3 ГБ и падает на небольших билд-хостах),
    # результат (standalone-сервер) идентичен.
    pnpm --filter frontend exec next build --webpack && \
    npm uninstall -g pnpm && \
    npm cache clean --force && \
    rm -rf /root/.local/share/pnpm /root/.cache

# Stage 2: Minimal Node SSR runtime (Next.js standalone server)
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Runtime backend URL for SSR data fetching (server components read it per request).
# Override at run time, e.g. `-e API_URL=http://backend:4000`.
# Falls back to NEXT_PUBLIC_API_URL, then http://localhost:4000 (see src/lib/server-api.ts).
ENV API_URL=http://localhost:4000

# Monorepo standalone layout: server entry lands at apps/frontend/server.js
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health | grep -q '"status":"ok"' || exit 1

CMD ["node", "apps/frontend/server.js"]
