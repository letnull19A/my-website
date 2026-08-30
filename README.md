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
│   └── backend/         # Node.js + json-server — мок API
│       ├── data/db.json
│       ├── routes.json  # /api/v1/* -> /*
│       ├── server.js
│       ├── Dockerfile
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
pnpm dev:backend           # json-server → http://localhost:4000
pnpm build:frontend        # статический билд → apps/frontend/out
pnpm lint:frontend         # eslint для фронтенда
```

Изнутри приложения — обычные `pnpm dev / build / lint` внутри `apps/frontend` или `apps/backend`.

## Docker

Каждый сервис собирается из контекста своего приложения (не знает о монорепозитории):

```bash
docker build -t my-website-frontend ./apps/frontend
docker build -t my-website-backend ./apps/backend
# альтернативно:
# docker build -f apps/frontend/Dockerfile -t my-website-frontend ./apps/frontend
# docker build -f apps/backend/Dockerfile -t my-website-backend ./apps/backend

docker run -p 3000:3000 my-website-frontend
docker run -p 4000:4000 my-website-backend
```

- Frontend: multi-stage `node:24-alpine` → `static-web-server` (раздаёт `/app` = `out` + `public`).
- Backend: `node:24-alpine`, `node server.js` (json-server, `0.0.0.0:4000`).

## API

- Спека: [`docs/api-data-spec.md`](docs/api-data-spec.md) — типы `Article` / `Case`, Markdown GFM.
- Префикс будущего API: `/api/v1` (зарезервирован, не реализован в инфраструктурной задаче).
- Моки: [`apps/backend/data/db.json`](apps/backend/data/db.json) — коллекции `articles`, `cases`.
- Реврайт для совместимости: `apps/backend/routes.json` маппит `/api/v1/*` → `/*`.
- Проектирование и реализация эндпоинтов — отдельная задача следующего агента.

## Deployment

- Frontend: GitHub Pages (`.github/workflows/nextjs.yml` → `apps/frontend/out`).
- Статический экспорт (`output: "export"`, `images.unoptimized: true`) — серверные фичи Next.js не используются.

## AGENTS

- Общая маршрутизация: [`AGENTS.md`](AGENTS.md)
- Frontend: [`apps/frontend/AGENTS.md`](apps/frontend/AGENTS.md)
- Backend: [`apps/backend/AGENTS.md`](apps/backend/AGENTS.md)
