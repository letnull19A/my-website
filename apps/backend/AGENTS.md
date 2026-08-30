# Backend — AGENTS

## Project facts — backend

- **Workspace package**: `backend` (`apps/backend/package.json`, private, `type: "module"`). Node.js 24.
- **Runtime**: чистый Node.js + `json-server` (мок-данные, без реальной БД, без ORM).
- **Package manager**: pnpm 11. Установка через корень: `pnpm install --frozen-lockfile`. Запуск из корня: `pnpm --filter backend <script>` или `pnpm dev:backend`.
- **Port / Host**: `PORT=4000`, `HOST=0.0.0.0`. Должен слушать на `0.0.0.0` для Docker. Health: `GET /` или `GET /api/v1/articles` (после настройки префикса).
- **Data**: `apps/backend/data/db.json` — единственный источник мок-данных. Коллекции: `articles`, `cases` (структура по `docs/api-data-spec.md`). Слаги — `a-z`, `0-9`, `-`, глобально уникальны.
- **API prefix**: `/api/v1` — **зарезервирован**, но не реализован в инфраструктурной задаче. Файл `apps/backend/routes.json` содержит маппинг `"/api/v1/*": "/$1"` для совместимости. Полноценное проектирование эндпоинтов, валидация, пагинация, фильтры и кастомные middleware — задача API-агента, не этого PR.
- **Server entry**: `apps/backend/server.js` — тонкий лаунчер `json-server` с fallback на CLI. Поддерживает как `json-server@1.x` (programmatic `createApp`), так и `0.17.x` (`--watch` + `--routes`). Переменные окружения: `PORT`, `HOST`.
- **Docker**: `apps/backend/Dockerfile` (`node:24-alpine`, `pnpm install --filter backend`, `EXPOSE 4000`, `CMD ["node", "server.js"]`). Сборка из корня: `docker build -f apps/backend/Dockerfile -t my-website-backend .` Запуск: `docker run -p 4000:4000 my-website-backend`.
- **Frontend boundary**: фронтенд (`apps/frontend`) не импортирует код бэкенда напрямую. Связь — только по HTTP. Фронт остаётся static export (`output: "export"`), поэтому не может проксировать API на этапе сборки без отдельного хоста.

## Commands

```bash
pnpm dev:backend        # из корня — json-server на http://localhost:4000
pnpm --filter backend dev   # алиас
pnpm --filter backend start # production старт (тот же server.js)

# Внутри apps/backend:
pnpm dev   # node server.js
pnpm start # node server.js
pnpm run db # напрямую json-server data/db.json --port 4000 --host 0.0.0.0
```

## Data contract

Источник правды: `docs/api-data-spec.md`.

Минимальный `data/db.json`:

```json
{
  "articles": [{ "slug": "...", "title": "...", "description": "...", "subtitle": "...", "date": "2026-08-10", "readTime": "4 MIN READ", "category": "BACKEND // ARCHITECTURE", "content": "...", "coverImage": null }],
  "cases": [{ "slug": "...", "title": "...", "role": "...", "description": "...", "fullTitle": "...", "subtitle": "...", "actions": [], "meta": { "role": "...", "duration": "...", "status": "...", "stack": "..." }, "problem": "...", "solution": "...", "results": "...", "logo": "/icons/...", "previewImage": null }]
}
```

- `coverImage`, `previewImage` могут быть `null` — фронт рендерит placeholder.
- `content` — Markdown + GFM (таблицы, код-блоки, цитаты).
- Не менять контракт без согласования с frontend-агентом.

## Docker

- Multi-stage не требуется — бэкенд лёгкий.
- Кэширование: сначала копируются `pnpm-workspace.yaml`, `package.json`, `apps/backend/package.json`, затем `pnpm install --filter backend`.
- Healthcheck (для будущего): `CMD-SHELL wget -qO- http://localhost:4000/api/v1/articles || wget -qO- http://localhost:4000/articles || exit 1`.

## Границы ответственности

- **Этот агент (инфраструктура)**: создал структуру `apps/backend`, `data/db.json` с валидными моками, `routes.json`, `server.js`, `Dockerfile`, `AGENTS.md`. Не проектирует эндпоинты, не добавляет валидацию/мiddleware.
- **Следующий агент (API)**: детальная реализация `/api/v1/articles`, `/api/v1/cases` (GET list, GET by slug, 404), фильтрация, пагинация, CORS, возможно пагинация и кэширование. Может заменить `server.js` на Express/Hono обвязку, но должен сохранить совместимость с `data/db.json` и префиксом `/api/v1`.
- Не трогать `apps/frontend` сверх необходимого.

## Где что искать

- Спека: `docs/api-data-spec.md`
- Моки: `apps/backend/data/db.json`
- Маршруты: `apps/backend/routes.json`
- Лаунчер: `apps/backend/server.js`
- Общие правила монорепозитория: `AGENTS.md` в корне
- Фронтенд: `apps/frontend/AGENTS.md`
