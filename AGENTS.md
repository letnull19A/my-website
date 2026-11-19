<!-- intent-skills:start -->
# TanStack Intent - before editing files, run the matching guidance command.
# Shared tRPC skills (root) — контракт и трансформер, общие для frontend/backend
tanstackIntent:
  - id: "@trpc/server#server-setup"
    run: "pnpm dlx @tanstack/intent@latest load @trpc/server#server-setup"
    for: "Initialize tRPC with initTRPC.create(), define routers with t.router(), create procedures with .query()/.mutation()/.subscription(), configure context with createContext(), export AppRouter type, merge routers with t.mergeRouters(), lazy-load routers with lazy()."
  - id: "@trpc/server#validators"
    run: "pnpm dlx @tanstack/intent@latest load @trpc/server#validators"
    for: "Configure input and output validation with .input() and .output() using Zod, Yup, Superstruct, ArkType, Valibot, Effect, or custom validator functions. Chain multiple .input() calls to merge object schemas. Standard Schema protocol support. Output validation returns INTERNAL_SERVER_ERROR on failure."
  - id: "@trpc/client#superjson"
    run: "pnpm dlx @tanstack/intent@latest load @trpc/client#superjson"
    for: "Configure SuperJSON transformer on both server initTRPC.create({ transformer: superjson }) and every client terminating link (httpBatchLink, httpLink, wsLink, httpSubscriptionLink) to support Date, Map, Set, BigInt over the wire. Transformer must match on both sides. In v11, transformer goes on individual links, not the client constructor."
  - id: "@trpc/server#trpc-router"
    run: "pnpm dlx @tanstack/intent@latest load @trpc/server#trpc-router"
    for: "Entry point for all tRPC skills. Decision tree routing by task: initTRPC.create(), t.router(), t.procedure, createTRPCClient, adapters, subscriptions, React Query, Next.js, links, middleware, validators, error handling, caching, FormData."
<!-- intent-skills:end -->

# AGENTS — Monorepo Entrypoint

Этот файл — корневой entrypoint монорепозитория. Общие правила и маршрутизация по приложениям.
Детальные правила каждого приложения — в его собственном `AGENTS.md`.

## Структура монорепозитория

```
my-website/
├── apps/
│   ├── frontend/            # Next.js 16.3 — SSR (standalone), tRPC
│   │   ├── src/
│   │   ├── public/
│   │   ├── Dockerfile       # из контекста корня: docker build -f apps/frontend/Dockerfile .
│   │   ├── package.json     # name: frontend
│   │   └── AGENTS.md
│   └── backend/             # NestJS 12 Fastify + tRPC
│       ├── src/             # Nest modules (db, trpc, health)
│       ├── data/db.json     # мок-данные (articles, cases)
│       ├── Dockerfile       # multi-stage: root context → node dist/main.js
│       ├── package.json     # name: backend
│       └── AGENTS.md
├── packages/
│   ├── schemas/             # @my-website/schemas — zod-схемы + типы (единый источник)
│   └── api/                 # @my-website/api — tRPC-роутеры, AppRouter
├── docs/
│   ├── api-data-spec.md     # (deprecated) superseded by @my-website/schemas
│   └── design/*.pen
├── pnpm-workspace.yaml      # packages: ["apps/*", "packages/*"]
├── package.json             # workspace root (private, scripts с фильтрами)
└── AGENTS.md                # ← ты здесь
```

## Package manager

- **pnpm 11** — единственный пакетный менеджер. Используй `pnpm install`, не `npm install`.
- Lockfile: `pnpm-lock.yaml` в корне (единый для всех workspace).
- Workspace объявлен в `pnpm-workspace.yaml` как `packages: ["apps/*", "packages/*"]`.
- Установка: `pnpm install --frozen-lockfile` или `pnpm install --ignore-scripts` (обход approve-builds)
- Изолированные команды: `pnpm --filter frontend <script>`, `pnpm --filter backend <script>`, `pnpm --filter @my-website/schemas build`

## Корневые команды

```bash
pnpm install              # установить зависимости всех workspace
pnpm dev:frontend          # Next.js dev server (http://localhost:3000)
pnpm dev:backend           # NestJS dev (http://localhost:4000, watch)
pnpm build:frontend        # pnpm --filter frontend build -> apps/frontend/.next (standalone SSR)
pnpm lint:frontend         # pnpm --filter frontend lint
pnpm build                 # алиас build:frontend
```

## Приложения

### frontend — `apps/frontend`

- Next.js 16.3, SSR (`output: "standalone"`), Tailwind v4, shadcn/ui (`base-nova`), `lucide`, `@base-ui/react`, Storybook, tRPC (`@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`, `superjson`), `@next/third-parties`.
- Деплой: Docker-образ Node SSR-сервера (`.next/standalone`, CMD `node apps/frontend/server.js`) через Dokploy (не GitHub Pages).
- Env: build-args `NEXT_PUBLIC_SITE_URL` (дефолт `https://letnull19a.github.io/my-website`) и `NEXT_PUBLIC_API_URL` (дефолт `http://localhost:4000`) инлайнятся в клиентский бандл при сборке; runtime-переменные `SITE_URL` (`src/lib/site.ts`) и `API_URL` (`src/lib/server-api.ts`) читаются на сервере в рантайме и перекрывают их.
- Данные: SSR-страницы (`articles`, `cases`, home) читают данные в рантайме через `src/lib/server-api.ts` (tRPC, `no-store`, таймаут 5 c; при ошибке — фолбэк «данные недоступны», без подмены моками). tRPC-клиент `src/lib/trpc/client.ts` (`httpBatchLink` → `/trpc` + superjson + `createTRPCOptionsProxy`) + `provider.tsx` (QueryClient) — для клиентских компонентов.
- Аналитика: GTM (`GTM-5PLT35CF`, константа `GTM_ID` в `src/lib/site.ts`) грузится компонентом `GtmGate` **только после cookie-согласия**: `CookieBanner` пишет решение в localStorage (`src/lib/consent.ts`), `GtmGate` подписан на событие и инжектит `gtm.js` после «OK». В SSR HTML `gtm.js` не попадает никогда — не рендерить `GoogleTagManager` в layout напрямую.
- Алиасы: `@/*` → `apps/frontend/src/*`.
- Тёмная тема only.
- Подробнее: [`apps/frontend/AGENTS.md`](apps/frontend/AGENTS.md)

### backend — `apps/backend`

- NestJS 12 Fastify (`@nestjs/platform-fastify`, `@fastify/cors`), tRPC (`@trpc/server` + `fastifyTRPCPlugin`) — без Swagger, без REST-эндпоинтов articles/cases.
- Данные: `apps/backend/data/db.json` (через `DbService` → `DataSources`). `DbService` валидирует `db.json` zod-схемами при старте — fail-fast при невалидных данных.
- Порт: `4000`, host `0.0.0.0`, health: `GET /health`, `GET /api/health`; tRPC: `GET /trpc/*` (queries), `POST` — только для mutations.
- Контракт — код: `packages/schemas` (zod) + `packages/api` (AppRouter).
- Подробнее: [`apps/backend/AGENTS.md`](apps/backend/AGENTS.md)

### packages — шареные пакеты

- `@my-website/schemas`: zod-схемы `Article`, `Case`, `Health` + `z.infer` типы + `SlugSchema`/`BySlugInputSchema` + `DataSources` интерфейсы. `Case.actions[].emphasis: 'primary' | 'secondary'` — семантика, UI-варианты кнопок в контракт не входят. Зависимость только от `zod`.
- `@my-website/api`: tRPC-роутеры `articles`, `cases`, `health` + `appRouter`/`AppRouter`. Зависит от `schemas`, `@trpc/server`, `superjson`.

## Docker

Сборка **из контекста корня монорепозитория** (чтобы видеть `packages/`):

```bash
docker build -f apps/frontend/Dockerfile -t my-website-frontend . \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_SITE_URL=https://example.com
docker build -f apps/backend/Dockerfile -t my-website-backend .

docker run -p 3000:3000 my-website-frontend
docker run -p 4000:4000 my-website-backend
```

- Frontend: `node:24-alpine`, из `.next/standalone` (+ `.next/static`, `public`), CMD `node apps/frontend/server.js`; healthcheck `GET /api/health`. Build-args `NEXT_PUBLIC_*` запекаются в клиентский бандл; runtime `-e API_URL=...` — URL бэкенда для SSR.
- Backend: `node:24-alpine`, `node dist/main.js` (Fastify, tRPC).
- Контекст — корень монорепозитория (не `./apps/frontend`).

## API contract

- Префикс tRPC: `/trpc` (без версионирования).
- Источник правды: `packages/schemas` (zod-схемы) + `packages/api` (AppRouter). `docs/api-data-spec.md` deprecated.
- Валидация: zod (input в процедурах, `db.json` — в `DbService` на старте), типы — `z.infer`. Код и есть документация.
- Ответы без конвертов: `articles.list` → `Article[]`, `articles.bySlug` → `Article`, `cases.list` → `Case[]`, `cases.bySlug` → `Case` (NOT_FOUND если нет), `health.ping` → `{ status: 'ok', uptime }`.
- Транспорт: queries — `GET` (`?input={"json":{...}}` в superjson-формате), mutations — `POST`; клиент — `httpBatchLink` + superjson.

## Границы ответственности

- Инфраструктурный агент: монорепозиторий, workspace, Docker (root-context), шареные пакеты — **завершён**.
- API — через tRPC (`packages/api`), Fastify, без Swagger.
- Frontend-агент: компоненты, tRPC-интеграция секций, стили.

## Где что искать

- Контракт: `packages/schemas/src/`, `packages/api/src/`
- Моки: `apps/backend/data/db.json`
- Nest entry: `apps/backend/src/main.ts` (Fastify + fastifyTRPCPlugin)
- Frontend клиент: `apps/frontend/src/lib/trpc/`
- Аналитика/consent: `apps/frontend/src/lib/consent.ts`, `apps/frontend/src/components/gtm-gate/`
- Общие правила: `AGENTS.md` в корне
