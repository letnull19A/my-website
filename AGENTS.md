<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `pnpm dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# AGENTS — Monorepo Entrypoint

Этот файл — корневой entrypoint монорепозитория. Общие правила и маршрутизация по приложениям.
Детальные правила каждого приложения — в его собственном `AGENTS.md`.

## Структура монорепозитория

```
my-website/
├── apps/
│   ├── frontend/            # Next.js 16.3 — статический экспорт, tRPC-клиент
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
pnpm build:frontend        # pnpm --filter frontend build -> apps/frontend/out
pnpm lint:frontend         # pnpm --filter frontend lint
pnpm build                 # алиас build:frontend
```

## Приложения

### frontend — `apps/frontend`

- Next.js 16.3, static export (`output: "export"`), Tailwind v4, shadcn/ui (`base-nova`), `lucide`, `@base-ui/react`, Storybook, tRPC (`@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`, `superjson`).
- Деплой: Docker-образ `static-web-server` из `apps/frontend/out` через Dokploy (не GitHub Pages).
- Env (build-args, запекаются в static export): `NEXT_PUBLIC_SITE_URL` (дефолт `https://letnull19a.github.io/my-website`), `NEXT_PUBLIC_API_URL` (дефолт `http://localhost:4000`). Меняются пересборкой образа.
- tRPC-клиент: `src/lib/trpc/client.ts` (httpBatchLink → `/trpc` + superjson), `src/lib/trpc/provider.tsx` (QueryClient), секции `articles`/`cases` используют `useQuery` с фолбэком на `src/config/` моки.
- Алиасы: `@/*` → `apps/frontend/src/*`.
- Тёмная тема only.
- Подробнее: [`apps/frontend/AGENTS.md`](apps/frontend/AGENTS.md)

### backend — `apps/backend`

- NestJS 12 Fastify (`@nestjs/platform-fastify`, `@fastify/cors`), tRPC (`@trpc/server` + `fastifyTRPCPlugin`) — без Swagger, без REST-эндпоинтов articles/cases.
- Данные: `apps/backend/data/db.json` (через `DbService` → `DataSources`).
- Порт: `4000`, host `0.0.0.0`, health: `GET /health`, `GET /api/health`, `GET /api/v1/health`; tRPC: `POST /trpc/*`.
- Контракт — код: `packages/schemas` (zod) + `packages/api` (AppRouter).
- Подробнее: [`apps/backend/AGENTS.md`](apps/backend/AGENTS.md)

### packages — шареные пакеты

- `@my-website/schemas`: zod-схемы `Article`, `Case`, `Health` + `z.infer` типы + `DataSources` интерфейсы. Зависимость только от `zod`.
- `@my-website/api`: tRPC-роутеры `articles`, `cases`, `health` + `appRouter`/`AppRouter`. Зависит от `schemas`, `@trpc/server`, `superjson`.

## Docker

Сборка **из контекста корня монорепозитория** (чтобы видеть `packages/`):

```bash
docker build -f apps/frontend/Dockerfile -t my-website-frontend .
docker build -f apps/backend/Dockerfile -t my-website-backend . \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_SITE_URL=https://example.com

docker run -p 3000:3000 my-website-frontend
docker run -p 4000:4000 my-website-backend
```

- Frontend: `static-web-server` раздаёт `/app` (`out` + `public`), build-args запекаются в бандл.
- Backend: `node:24-alpine`, `node dist/main.js` (Fastify, tRPC).
- Контекст — корень монорепозитория (не `./apps/frontend`).

## API contract

- Префикс tRPC: `/trpc`.
- Источник правды: `packages/schemas` (zod-схемы) + `packages/api` (AppRouter). `docs/api-data-spec.md` deprecated.
- Валидация: zod (в процедурах), типы — `z.infer`. Код и есть документация.

## Границы ответственности

- Инфраструктурный агент: монорепозиторий, workspace, Docker (root-context), шареные пакеты — **завершён**.
- API — через tRPC (`packages/api`), Fastify, без Swagger.
- Frontend-агент: компоненты, tRPC-интеграция секций, стили.

## Где что искать

- Контракт: `packages/schemas/src/`, `packages/api/src/`
- Моки: `apps/backend/data/db.json`
- Nest entry: `apps/backend/src/main.ts` (Fastify + fastifyTRPCPlugin)
- Frontend клиент: `apps/frontend/src/lib/trpc/`
- Общие правила: `AGENTS.md` в корне
