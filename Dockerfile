# Stage 1: Build frontend
FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

COPY . .

RUN pnpm build && \
    npm uninstall -g pnpm && \
    npm cache clean --force && \
    rm -rf node_modules src /root/.local/share/pnpm /root/.cache

# Stage 2: Ultra-minimal static server (~150KB base)
FROM joseluisq/static-web-server:2-debian

WORKDIR /

COPY --from=builder /app/out /app
COPY --from=builder /app/public /app

ENV PORT=3000
ENV SERVER_PORT=${PORT}
ENV SERVER_ROOT=/app
ENV SERVER_HEALTH=true
ENV SERVER_FALLBACK_PAGE=/app/index.html
ENV SERVER_IGNORE_HIDDEN_FILES=true

EXPOSE ${PORT}
