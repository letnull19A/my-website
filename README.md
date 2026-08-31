# my-website — pnpm Monorepo

Статический сайт-портфолио + мок-API. Два изолированных приложения в одном репозитории.

## Структура

```
my-website/
├── apps/
│   ├── frontend/        # Next.js 16.3 — static export (output: "export")
│   │   ├── src/
│   │   ├── public/
│   │   ├── Dockerfile
│   │   └── AGENTS.md
│   └── backend/         # NestJS 12 + Swagger — мок API (TypeScript)
│       ├── src/         # articles, cases, health modules
│       ├── data/db.json
│       ├── openapi.yaml # static OpenAPI (референс)
│       ├── Dockerfile   # multi-stage: nest build → node dist/main
│       └── AGENTS.md
├── docs/api-data-spec.md
├── pnpm-workspace.yaml  # packages: ["apps/*"]
└── AGENTS.md            # entrypoint для агентов
```

## Требования

- Node.js 24
- pnpm 11 (`npm install -g pnpm@11`)

## Команды (из корня)

```bash
pnpm install              # установить все workspace-зависимости
pnpm dev:frontend          # Next.js dev → http://localhost:3000
pnpm dev:backend           # NestJS dev (watch) → http://localhost:4000
pnpm build:frontend        # статический билд → apps/frontend/out
pnpm lint:frontend         # eslint для фронтенда
pnpm --filter backend build # nest build → apps/backend/dist
```

Изнутри приложения — обычные `pnpm dev / build` внутри `apps/frontend` или `apps/backend`.

## Docker

Каждый сервис собирается из контекста своего приложения (не знает о монорепозитории):

```bash
docker build -t my-website-frontend ./apps/frontend
docker build -t my-website-backend ./apps/backend

docker run -p 3000:3000 my-website-frontend
docker run -p 4000:4000 my-website-backend
```

- Frontend: multi-stage `node:24-alpine` → `static-web-server` (раздаёт `/app` = `out` + `public`).
- Backend: multi-stage `node:24-alpine` (`pnpm build` → `node dist/main.js`), tRPC на `/trpc`, данные из `data/db.json`.

## API

- Контракт — код: [`packages/schemas`](packages/schemas) (zod) + [`packages/api`](packages/api) (tRPC AppRouter). `docs/api-data-spec.md` deprecated.
- tRPC: `GET /trpc/articles.list` → `Article[]`, `GET /trpc/articles.bySlug?input={"json":{"slug":"..."}}` → `Article` (404, если нет), аналогично `cases`; queries — `GET`, mutations — `POST`. Health: `GET /health`, `/api/health`.
- Моки: [`apps/backend/data/db.json`](apps/backend/data/db.json).

## Deployment

- Frontend: GitHub Pages (`.github/workflows/nextjs.yml` → `apps/frontend/out`).
- Статический экспорт (`output: "export"`, `images.unoptimized: true`) — серверные фичи Next.js не используются.

## AGENTS

- Общая маршрутизация: [`AGENTS.md`](AGENTS.md)
- Frontend: [`apps/frontend/AGENTS.md`](apps/frontend/AGENTS.md)
- Backend: [`apps/backend/AGENTS.md`](apps/backend/AGENTS.md) — NestJS + Swagger
