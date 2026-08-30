FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@11

# Root workspace manifests + lockfile for layer caching
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages ./packages
COPY apps/backend/package.json ./apps/backend/package.json

RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds 2>&1 | tail -n 20

# Copy backend source (+ data)
COPY apps/backend ./apps/backend

# Build shared packages then backend
RUN pnpm --filter @my-website/schemas build && \
    pnpm --filter @my-website/api build && \
    pnpm --filter backend build

FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./package.json
COPY --from=builder /app/apps/backend/data ./data
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 4000

CMD ["node", "dist/main.js"]
