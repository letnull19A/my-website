# AGENTS — Monorepo Entrypoint

Этот файл — корневой entrypoint монорепозитория. Общие правила и маршрутизация по приложениям.
Детальные правила каждого приложения — в его собственном `AGENTS.md`.

## Структура монорепозитория

```
my-website/
├── apps/
│   ├── frontend/            # Next.js 16.3 — статический экспорт
│   │   ├── src/
│   │   ├── public/
│   │   ├── Dockerfile
│   │   ├── package.json     # name: frontend
│   │   └── AGENTS.md        # детальные правила frontend
│   └── backend/             # NestJS 12 (TypeScript) + Swagger
│       ├── src/             # Nest modules (articles, cases, health)
│       ├── data/db.json     # мок-данные (articles, cases)
│       ├── openapi.yaml     # статический OpenAPI (референс)
│       ├── Dockerfile       # multi-stage: nest build → node dist/main
│       ├── package.json     # name: backend
│       └── AGENTS.md        # детальные правила backend
├── docs/
│   ├── api-data-spec.md
│   └── design/*.pen
├── .github/workflows/nextjs.yml
├── package.json             # workspace root (private, scripts с фильтрами)
├── pnpm-workspace.yaml      # packages: ["apps/*"]
└── AGENTS.md                # ← ты здесь
```

## Package manager

- **pnpm 11** — единственный пакетный менеджер. Используй `pnpm install`, не `npm install`.
- Lockfile: `pnpm-lock.yaml` в корне (единый для всех workspace).
- Workspace объявлен в `pnpm-workspace.yaml:1-2` как `packages: ["apps/*"]`.
- Установка: `pnpm install --frozen-lockfile`
- Изолированные команды: `pnpm --filter frontend <script>`, `pnpm --filter backend <script>`

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

- Next.js 16.3, static export (`output: "export"`), Tailwind v4, shadcn/ui (`base-nova`), `lucide`, `@base-ui/react`, Storybook.
- Деплой: статика из `apps/frontend/out` на GitHub Pages (`.github/workflows/nextjs.yml`).
- Алиасы: `@/*` → `apps/frontend/src/*` (см. `apps/frontend/tsconfig.json`, `apps/frontend/components.json`).
- Тёмная тема only: не добавлять light тему или переключатель.
- Подробнее: [`apps/frontend/AGENTS.md`](apps/frontend/AGENTS.md)

### backend — `apps/backend`

- NestJS 12 (TypeScript) + Swagger (`@nestjs/swagger`), мок-данные из `data/db.json` без БД.
- Данные: `apps/backend/data/db.json` (`articles`, `cases` по `docs/api-data-spec.md`).
- Порт: `4000`, host `0.0.0.0`, health: `GET /health`, `GET /api/v1/articles` → `{ items: [] }`, Swagger: `GET /api/docs`.
- API prefix: `/api/v1` — реализован (`@Controller('api/v1/...')` + алиасы `/articles`, `/cases`), Swagger подключён в `src/main.ts`.
- Подробнее: [`apps/backend/AGENTS.md`](apps/backend/AGENTS.md)

## Docker

Каждый сервис имеет свой Dockerfile и собирается **из контекста своего приложения** — приложение не знает о монорепозитории:

```bash
docker build -t my-website-frontend ./apps/frontend
docker build -t my-website-backend ./apps/backend
# альтернативно с явным -f:
# docker build -f apps/frontend/Dockerfile -t my-website-frontend ./apps/frontend
# docker build -f apps/backend/Dockerfile -t my-website-backend ./apps/backend

docker run -p 3000:3000 my-website-frontend
docker run -p 4000:4000 my-website-backend
```

- Frontend: multi-stage, `static-web-server` раздаёт `/app` (`out` + `public`).
- Backend: `node:24-alpine`, `node dist/main.js` (NestJS, Swagger на `/api/docs`).
- Контекст сборки — директория приложения (`./apps/frontend` или `./apps/backend`), а не корень монорепозитория.

## API contract

- Префикс: `/api/v1` (не `api/v1` без слэша).
- Спека: `docs/api-data-spec.md` — источник правды для `Article`/`Case`.
- Инфраструктурный агент **не** проектирует эндпоинты и не добавляет кастомные middleware — только каркас.

## Границы ответственности

- Инфраструктурный агент (текущий): структура монорепозитория, workspace, Docker, CI пути, мок `db.json`, AGENTS разделение — **завершён, backend теперь NestJS + Swagger**.
- API-агент: расширение Nest модулей (`articles`, `cases`), добавление пагинации/фильтров/валидации, интеграция фронта (базовые эндпоинты уже реализованы).
- Frontend-агент: компоненты `src/components/ui/`, утилиты `src/lib/utils.ts`, Storybook, стили.

## Где что искать

- Общие факты монорепозитория — этот файл.
- Правила Next.js/Tailwind/shadcn — `apps/frontend/AGENTS.md`.
- Правила NestJS/Swagger/моков/Docker — `apps/backend/AGENTS.md`.
- Дизайн: `docs/design/*.pen`
