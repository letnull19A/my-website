<!-- intent-skills:start -->
# TanStack Intent - before editing files, run the matching guidance command.
# Backend tRPC skills — Fastify adapter, middleware, ошибки, auth
tanstackIntent:
  - id: "@trpc/server#adapter-fastify"
    run: "pnpm dlx @tanstack/intent@latest load @trpc/server#adapter-fastify"
    for: "Mount tRPC as a Fastify plugin with fastifyTRPCPlugin from @trpc/server/adapters/fastify. Configure prefix, trpcOptions (router, createContext, onError). Enable WebSocket subscriptions with useWSS and @fastify/websocket. Set routerOptions.maxParamLength for batch requests. Requires Fastify v5+. FastifyTRPCPluginOptions for type-safe onError. CreateFastifyContextOptions provides req, res."
  - id: "@trpc/server#middlewares"
    run: "pnpm dlx @tanstack/intent@latest load @trpc/server#middlewares"
    for: "Create and compose tRPC middleware with t.procedure.use(), extend context via opts.next({ ctx }), build reusable middleware with .concat() and .unstable_pipe(), define base procedures like publicProcedure and authedProcedure. Access raw input with getRawInput(). Logging, timing, OTEL tracing patterns."
  - id: "@trpc/server#error-handling"
    run: "pnpm dlx @tanstack/intent@latest load @trpc/server#error-handling"
    for: "Throw typed errors with TRPCError and error codes (NOT_FOUND, UNAUTHORIZED, BAD_REQUEST, INTERNAL_SERVER_ERROR), configure errorFormatter for client-side Zod error display, handle errors globally with onError callback, map tRPC errors to HTTP status codes with getHTTPStatusCodeFromError()."
  - id: "@trpc/server#auth"
    run: "pnpm dlx @tanstack/intent@latest load @trpc/server#auth"
    for: "Implement JWT/cookie authentication and authorization in tRPC using createContext for user extraction, t.middleware with opts.next({ ctx }) for context narrowing to non-null user, protectedProcedure base pattern, client-side Authorization headers via httpBatchLink headers(), WebSocket connectionParams, and SSE auth via cookies or EventSource polyfill custom headers."
  - id: "@trpc/server#caching"
    run: "pnpm dlx @tanstack/intent@latest load @trpc/server#caching"
    for: "Set HTTP cache headers on tRPC query responses via responseMeta callback for CDN and browser caching. Configure Cache-Control, s-maxage, stale-while-revalidate. Handle caching with batching and authenticated requests. Avoid caching mutations, errors, and authenticated responses."
<!-- intent-skills:end -->

# Backend — AGENTS

## Project facts — backend

- **Workspace package**: `backend` (`apps/backend/package.json`, private). Node.js 24, TypeScript.
- **Runtime**: **NestJS 12 Fastify** (`@nestjs/platform-fastify`, `@fastify/cors`) + **tRPC** (`@trpc/server` + `fastifyTRPCPlugin`), без Swagger, без REST-эндпоинтов articles/cases. Код — документация.
- **Package manager**: pnpm 11. Установка через корень: `pnpm install --ignore-scripts` (или `--frozen-lockfile`). Запуск из корня: `pnpm --filter backend <script>` или `pnpm dev:backend`.
- **Port / Host**: `PORT=4000`, `HOST=0.0.0.0`. Должен слушать на `0.0.0.0` для Docker. Health: `GET /health`, `GET /api/health`, `GET /api/v1/health`.
- **Data**: `apps/backend/data/db.json` — единственный источник мок-данных. Коллекции: `articles`, `cases` (структура по `packages/schemas`). Слаги — `a-z`, `0-9`, `-`, глобально уникальны.
- **API**: tRPC — `POST /trpc/*`. Процедуры: `articles.list`, `articles.bySlug`, `cases.list`, `cases.bySlug`, `health.ping`. Контракт — `packages/schemas` (zod) + `packages/api` (AppRouter). Валидация — zod в процедурах, типы — `z.infer`. REST-контроллеры удалены (только `health` REST для совместимости).
- **Swagger**: удалён. `openapi.yaml`, `routes.json` удалены.
- **Server entry**: `src/main.ts` — `NestFactory.create<NestFastifyApplication>(new FastifyAdapter())`, `@fastify/cors`, `fastifyTRPCPlugin` на двух префиксах. `src/app.module.ts` импортирует `DbModule`, `TrpcModule`, `HealthModule`. Источники данных — `DbService` → `DataSources` (интерфейсы из `@my-website/schemas`).
- **Docker**: `apps/backend/Dockerfile` — multi-stage `node:24-alpine`, **контекст — корень монорепозитория** (`docker build -f apps/backend/Dockerfile .`): builder `COPY pnpm-workspace.yaml, packages, apps/backend/package.json → pnpm install → COPY apps/backend → pnpm --filter schemas/api/backend build`, runner копирует `dist`, `node_modules`, `data`, `packages`. Запуск: `docker run -p 4000:4000 my-website-backend` → `node dist/main.js` (Fastify, tRPC).
- **Frontend boundary**: фронтенд (`apps/frontend`) не импортирует код бэкенда напрямую. Связь — только tRPC по `POST /trpc`.

## Commands

```bash
pnpm dev:backend          # из корня — nest start --watch → http://localhost:4000
pnpm --filter backend dev      # алиас
pnpm --filter backend build    # nest build → dist/
pnpm --filter backend start    # node dist/main.js

# Внутри apps/backend:
pnpm dev    # nest start --watch
pnpm build  # nest build
pnpm start  # node dist/main.js
```

tRPC после `pnpm dev`:
- `POST http://localhost:4000/trpc/articles.list` — `{ items: [...] }`
- `POST http://localhost:4000/trpc/articles.bySlug` — input `{ slug }`
- `GET http://localhost:4000/health` — health

## Data contract

Источник правды: `packages/schemas` (zod-схемы) + `packages/api` (AppRouter). `docs/api-data-spec.md` deprecated.

Минимальный `data/db.json`:

```json
{
  "articles": [{ "slug": "...", "title": "...", "description": "...", "subtitle": "...", "date": "2026-08-10", "readTime": "4 MIN READ", "category": "BACKEND // ARCHITECTURE", "content": "...", "coverImage": null }],
  "cases": [{ "slug": "...", "title": "...", "role": "...", "description": "...", "fullTitle": "...", "subtitle": "...", "actions": [], "meta": { "role": "...", "duration": "...", "status": "...", "stack": "..." }, "problem": "...", "solution": "...", "results": "...", "logo": "/icons/...", "previewImageSrc": null }]
}
```

- `coverImage`, `previewImageSrc` могут быть `null`.
- `content` — Markdown + GFM.
- Ответы tRPC: `articles.list` → `{ items: Article[] }`, `articles.bySlug` → `{ item: Article }` (NOT_FOUND если нет), аналогично cases.

## Docker

- Builder (root context): `COPY packages → pnpm install → COPY apps/backend → pnpm --filter schemas/api build → pnpm --filter backend build`.
- Runner: `COPY dist, node_modules, data, packages` → `node dist/main.js`.
- Контекст — **корень монорепозитория**: `docker build -f apps/backend/Dockerfile -t my-website-backend .`.

## Границы ответственности

- Код — документация; Swagger не используется.
- Дальнейшая разработка: новые процедуры в `packages/api`, новые zod-схемы в `packages/schemas`, расширение `DbService`, подключение реальной БД — через те же модули.

## Где что искать

- Контракт: `packages/schemas/src/`, `packages/api/src/`
- Моки: `apps/backend/data/db.json`
- Nest entry: `apps/backend/src/main.ts` (Fastify + fastifyTRPCPlugin)
- Модули: `apps/backend/src/db/`, `apps/backend/src/trpc/`, `apps/backend/src/health/`
- Общие правила: `AGENTS.md` в корне
