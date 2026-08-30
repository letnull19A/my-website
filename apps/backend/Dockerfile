FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git && npm install -g pnpm@11

# Dokploy may use either repo root or apps/backend as build context.
# We copy whatever context we get to /tmp/context and detect.
COPY . /tmp/context

ARG GIT_REPO=https://github.com/letnull19A/my-website.git
ARG GIT_REF=""

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
    test -f /app/pnpm-workspace.yaml || (echo "ERROR: pnpm-workspace.yaml not found. Ensure Docker build context is repository root (docker build -f apps/backend/Dockerfile .) . In Dokploy set Build Context to '.' and Dockerfile to 'apps/backend/Dockerfile'. You can also set GIT_REF build-arg to the branch to clone for app-context fallback." && exit 1)

RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds 2>&1 | tail -n 20

RUN pnpm --filter @my-website/schemas build && \
    pnpm --filter @my-website/api build && \
    pnpm --filter backend build

FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

# Copy workspace manifests for pnpm prod install in runner (ensures correct pnpm virtual store)
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
# Copy built artifacts
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/data ./apps/backend/data

RUN npm install -g pnpm@11 && pnpm install --frozen-lockfile --prod --ignore-scripts 2>&1 | tail -n 20

WORKDIR /app/apps/backend

EXPOSE 4000

CMD ["node", "dist/main.js"]
