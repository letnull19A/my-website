# Stage 1: Build frontend — supports both repo root and apps/frontend as build context
FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git && npm install -g pnpm@11

COPY . /tmp/context

ARG GIT_REPO=https://github.com/letnull19A/my-website.git
ARG GIT_REF=""
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

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
