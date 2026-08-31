<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
<!-- intent-skills:start -->
# TanStack Intent - before editing files, run the matching guidance command.
# Frontend tRPC skills — клиент, линки, React Query
tanstackIntent:
  - id: "@trpc/client#client-setup"
    run: "pnpm dlx @tanstack/intent@latest load @trpc/client#client-setup"
    for: "Create a vanilla tRPC client with createTRPCClient<AppRouter>(), configure link chain with httpBatchLink/httpLink, dynamic headers for auth, transformer on links (not client constructor). Infer types with inferRouterInputs and inferRouterOutputs. AbortController signal support. TRPCClientError typing."
  - id: "@trpc/client#links"
    run: "pnpm dlx @tanstack/intent@latest load @trpc/client#links"
    for: "Configure the tRPC client link chain: httpLink, httpBatchLink, httpBatchStreamLink, splitLink, loggerLink, wsLink, createWSClient, httpSubscriptionLink, unstable_localLink, retryLink. Choose the right terminating link. Route subscriptions via splitLink. Build custom links for SOA routing. Link options: url, headers, transformer, maxURLLength, maxItems, connectionParams, EventSource ponyfill."
  - id: "@trpc/tanstack-react-query#react-query-setup"
    run: "pnpm dlx @tanstack/intent@latest load @trpc/tanstack-react-query#react-query-setup"
    for: "Set up @trpc/tanstack-react-query with createTRPCContext(), TRPCProvider, useTRPC() hook, queryOptions/mutationOptions factories, query invalidation via queryClient.invalidateQueries with queryFilter, and type inference with inferInput/inferOutput."
<!-- intent-skills:end -->

## Project facts — frontend

- **Workspace package**: `frontend` (`apps/frontend/package.json`, private). Устанавливается через корень: `pnpm install --frozen-lockfile`.
- **Package manager**: pnpm 11 (lockfile: `pnpm-lock.yaml` в корне, pinned как `pnpm@11` в `Dockerfile:6`). Внутри `apps/frontend` используй `pnpm --filter frontend <script>` из корня или `pnpm <script>` внутри директории.
- **Next.js 16.3** — check `node_modules/next/dist/docs/` for API changes.
- **Deployment**: Static export (`output: "export"`), Docker-образ `static-web-server` из `apps/frontend/out` через Dokploy. `.github/workflows` удалён. Build-args: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL` (запекаются в static export, см. `src/lib/site.ts` и `src/lib/trpc/client.ts`).
- **Tailwind v4**: Uses `@tailwindcss/postcss` plugin. There is no `tailwind.config.js` — config lives in CSS via `@theme` directives and in `components.json`.
- **shadcn/ui**: Config at `apps/frontend/components.json`. Style: `base-nova`, RSC + TSX, icons from `lucide`. Add components with `pnpm --filter frontend dlx shadcn@latest add <component>` или `npx shadcn@latest add <component>` внутри `apps/frontend`.
- **Path aliases**: `@/*` → `apps/frontend/src/*` (set in `apps/frontend/tsconfig.json:22-24` + `apps/frontend/components.json:15-21`).
  - `@/components` → `src/components`, `@/components/ui` → `src/components/ui`, `@/lib` → `src/lib`, `@/lib/utils` → `src/lib/utils.ts`, `@/hooks` → `src/hooks`.
  - Обращение к компонентам — через `@/components/${componentName}` (например, `import { Button } from "@/components/ui/button"`).
  - Всегда используй алиас `@/` вместо относительных путей (`../`, `./`). Пример: `import { cn } from "@/lib/utils"` вместо `from "../../lib/utils"`.
  - Алиас резолвится через `baseUrl: "."` + `paths` в `tsconfig.json`; дополнительной настройки bundler не требуется (Next.js подхватывает автоматически).
- **Entry points**: `src/app/layout.tsx` (root layout), `src/app/page.tsx` (home), `src/app/about/page.tsx` (about) — все относительно `apps/frontend/`.
- **UI library**: `@base-ui/react` + `class-variance-authority` for component variants.
- **Design files**: `docs/design/*.pen` (Penpot references for portfolio/shadcn designs) — в корне.
- **Theme**: Dark-only — светлой темы нет. `src/app/globals.css:67-161` defines `:root` and `.dark` with identical dark tokens (`--background: #0C0D0A`, `color-scheme: dark`). Не добавлять светлую тему, переключатель темы или `light` варианты — сайт всегда в тёмной теме.

## Monorepo notes

- Код фронтенда живёт **только** в `apps/frontend/`. Импорты `@/` резолвятся внутри этого пакета, а не из корня.
- `next.config.ts:sassOptions.includePaths` указывает на `["./src/styles", "./src"]` относительно `apps/frontend/`.
- Статический билд: `pnpm --filter frontend build` → `apps/frontend/out`. Локально: `pnpm dev:frontend` из корня или `pnpm dev` внутри `apps/frontend`. Env: `NEXT_PUBLIC_SITE_URL` (дефолт `https://letnull19a.github.io/my-website`), `NEXT_PUBLIC_API_URL` (дефолт `http://localhost:4000`) — см. `src/lib/site.ts`.
- Docker: **контекст — корень монорепозитория** (`docker build -f apps/frontend/Dockerfile -t my-website-frontend .`). Builder копирует `packages/` и `apps/frontend/package.json` → `pnpm install` → `pnpm --filter schemas/api build && pnpm --filter frontend build`.
- Backend: не импортировать напрямую `apps/backend` в frontend-коде. Взаимодействие — только tRPC (`@trpc/client` → `/trpc` + superjson, queries — `GET`) через `src/lib/trpc/`.

## Commands

```bash
pnpm dev          # внутри apps/frontend — Start dev server (http://localhost:3000)
pnpm build        # внутри apps/frontend — Build static export to ./out (фактически apps/frontend/out)
pnpm start        # Serve production build (not used in Pages deploy)
pnpm lint         # ESLint (flat config in eslint.config.mjs)
pnpm storybook    # Storybook on http://localhost:6006

# Из корня (рекомендуется):
pnpm dev:frontend
pnpm build:frontend
pnpm lint:frontend
```

## Conventions

- Components go in `src/components/ui/` (shadcn convention from `components.json`).
- Shared utilities in `src/lib/utils.ts` (`cn` helper using `clsx` + `tailwind-merge`).
- ESLint uses flat config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- TypeScript: strict mode, no emit, incremental builds (`tsconfig.tsbuildinfo`).
- Не добавлять серверные зависимости, которые ломают `output: "export"`.

## API

- Источник правды: `packages/schemas` (zod) + `packages/api` (AppRouter). `docs/api-data-spec.md` deprecated.
- tRPC-клиент: `src/lib/trpc/client.ts` (`httpBatchLink` → `/trpc`, superjson, `createTRPCOptionsProxy` → `trpc`), `src/lib/trpc/provider.tsx` (QueryClient). Секции `articles`/`cases` используют `useQuery(trpc.<router>.list.queryOptions())` с фолбэком на `src/config/` моки (static export остаётся рабочим без бэкенда в рантайме).
- Ответы без конвертов: `articles.list` → `Article[]`, `cases.list` → `Case[]` — `data` сразу массив, не `data.items`.
- `Case.actions[].emphasis: 'primary' | 'secondary'` — семантика из API; маппинг в варианты кнопок — в `case-card.tsx` (`resolveVariant`), UI-варианты в контракт не приходят.
- Build-args запекаются в static export: `NEXT_PUBLIC_SITE_URL` (`src/lib/site.ts`), `NEXT_PUBLIC_API_URL` (`src/lib/trpc/client.ts`).
