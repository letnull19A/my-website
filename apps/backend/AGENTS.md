# Backend — AGENTS

## Project facts — backend

- **Workspace package**: `backend` (`apps/backend/package.json`, private). Node.js 24, TypeScript.
- **Runtime**: **NestJS 12** (TypeScript, `@nestjs/*@11.1.8` — latest stable, заявлен как 12) + `@nestjs/swagger` — вместо чистого `json-server`. Данные остаются моковыми из `data/db.json` без реальной БД.
- **Package manager**: pnpm 11. Установка через корень: `pnpm install --frozen-lockfile`. Запуск из корня: `pnpm --filter backend <script>` или `pnpm dev:backend`.
- **Port / Host**: `PORT=4000`, `HOST=0.0.0.0`. Должен слушать на `0.0.0.0` для Docker. Health: `GET /health`, `GET /api/health`, `GET /api/v1/health`.
- **Data**: `apps/backend/data/db.json` — единственный источник мок-данных. Коллекции: `articles`, `cases` (структура по `docs/api-data-spec.md`). Слаги — `a-z`, `0-9`, `-`, глобально уникальны.
- **API prefix**: `/api/v1` — реализован как `@Controller('api/v1/...')` (+ алиасы без префикса `/articles`, `/cases` для совместимости с json-server). `routes.json` оставлен для истории, но не используется Nest. Полноценное проектирование уже выполнено: `GET /api/v1/articles`, `GET /api/v1/articles/:slug`, `GET /api/v1/cases`, `GET /api/v1/cases/:slug` с ответами `{ items: [] }` / `{ item: {} }` и 404.
- **Swagger**: `@nestjs/swagger` + `swagger-ui-express`. UI: `http://localhost:4000/api/docs`, `http://localhost:4000/docs`, `http://localhost:4000/api/v1/docs`. JSON: `/api/openapi.json`, `/openapi.json`. Источник: `src/main.ts` (`DocumentBuilder`) + DTO с `@ApiProperty`; статический `openapi.yaml` дублирует спеке и остаётся в репо как референс (`docs/api-data-spec.md`).
- **Server entry**: `src/main.ts` — bootstrap NestFactory, `enableCors`, `ValidationPipe`, `SwaggerModule.createDocument/setup`. `src/app.module.ts` импортирует `ArticlesModule`, `CasesModule`, `HealthModule`.
- **Docker**: `apps/backend/Dockerfile` — multi-stage `node:24-alpine`: builder `pnpm install` → `pnpm build` (`nest build` → `dist/`), затем runner копирует `dist`, `node_modules`, `data`, `openapi.yaml`. Сборка из контекста приложения: `docker build -t my-website-backend ./apps/backend`. Запуск: `docker run -p 4000:4000 my-website-backend` → `node dist/main.js`.
- **Frontend boundary**: фронтенд (`apps/frontend`) не импортирует код бэкенда напрямую. Связь — только по HTTP (`/api/v1`). Фронт остаётся static export (`output: "export"`).

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

Swagger после `pnpm dev`:
- `http://localhost:4000/api/docs` — UI
- `http://localhost:4000/api/openapi.json` — JSON
- `http://localhost:4000/api/v1/articles` — пример данных

## Data contract

Источник правды: `docs/api-data-spec.md` + `src/**/dto/*.dto.ts` (декорированы `@ApiProperty`).

Минимальный `data/db.json`:

```json
{
  "articles": [{ "slug": "...", "title": "...", "description": "...", "subtitle": "...", "date": "2026-08-10", "readTime": "4 MIN READ", "category": "BACKEND // ARCHITECTURE", "content": "...", "coverImage": null }],
  "cases": [{ "slug": "...", "title": "...", "role": "...", "description": "...", "fullTitle": "...", "subtitle": "...", "actions": [], "meta": { "role": "...", "duration": "...", "status": "...", "stack": "..." }, "problem": "...", "solution": "...", "results": "...", "logo": "/icons/...", "previewImage": null }]
}
```

- `coverImage`, `previewImage` могут быть `null`.
- `content` — Markdown + GFM.
- Ответы: `GET /api/v1/articles` → `{ items: Article[] }`, `GET /api/v1/articles/:slug` → `{ item: Article }` (404 если нет), аналогично cases.

## Docker

- Builder: `COPY package.json` → `pnpm install` → `COPY . .` → `pnpm build`.
- Runner: `COPY dist, node_modules, data, openapi.yaml` → `node dist/main.js`.
- Контекст — `apps/backend`.

## Границы ответственности

- Инфраструктурный агент: создал NestJS каркас, DTO, Swagger, `data/db.json`, Dockerfile.
- Дальнейшая разработка: фильтры, пагинация, валидация `class-validator`, CORS fine-tuning, подключение реальной БД — делается в том же Nest приложении (расширение существующих модулей).

## Где что искать

- Спека: `docs/api-data-spec.md`
- Моки: `apps/backend/data/db.json`
- Nest entry: `apps/backend/src/main.ts`
- Модули: `apps/backend/src/articles/`, `apps/backend/src/cases/`, `apps/backend/src/health/`
- Статический OpenAPI: `apps/backend/openapi.yaml`
- Общие правила: `AGENTS.md` в корне
