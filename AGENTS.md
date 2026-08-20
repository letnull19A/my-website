<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project facts

- **Package manager**: pnpm (lockfile: `pnpm-lock.yaml`). Use `pnpm install`, not `npm install`.
- **Next.js 16.3** — check `node_modules/next/dist/docs/` for API changes.
- **Deployment**: Static export to GitHub Pages. CI pushes `./out` via `.github/workflows/nextjs.yml`. Do not add server-side features or API routes that require a Node server.
- **Tailwind v4**: Uses `@tailwindcss/postcss` plugin. There is no `tailwind.config.js` — config lives in CSS via `@theme` directives and in `components.json`.
- **shadcn/ui**: Config at `components.json`. Style: `base-nova`, RSC + TSX, icons from `lucide`. Add components with `npx shadcn@latest add <component>`.
- **Path alias**: `@/*` → `./src/*` (set in `tsconfig.json`).
- **Entry points**: `src/app/layout.tsx` (root layout), `src/app/page.tsx` (home), `src/app/about/page.tsx` (about).
- **UI library**: `@base-ui/react` + `class-variance-authority` for component variants.
- **Design files**: `docs/design/*.pen` (Penpot references for portfolio/shadcn designs).

## Commands

```
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Build static export to ./out
pnpm start        # Serve production build (not used in Pages deploy)
pnpm lint         # ESLint (flat config in eslint.config.mjs)
```

## Conventions

- Components go in `src/components/ui/` (shadcn convention from `components.json`).
- Shared utilities in `src/lib/utils.ts` (`cn` helper using `clsx` + `tailwind-merge`).
- ESLint uses flat config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- TypeScript: strict mode, no emit, incremental builds (`tsconfig.tsbuildinfo`).
