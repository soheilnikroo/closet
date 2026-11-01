# Closet

AI personal stylist & digital wardrobe — foundation monorepo.

## Stack

- **Web:** React 19 + React Router v8 Framework Mode (`ssr: false` CSR) + Vite 8 + Tailwind CSS v4 + MD3 green design system
- **API:** Fastify 5 + Drizzle + PostgreSQL
- **Language:** TypeScript 7 (catalog-pinned across the monorepo)
- **Auth:** Clerk (CSR `@clerk/clerk-react` + `@clerk/fastify`)
- **i18n:** `en-GB` / `fa-IR` with RTL
- **Packages:** `@closet/shared` Zod contracts

## Tooling

| Tool                             | Role                                                 |
| -------------------------------- | ---------------------------------------------------- |
| **Oxlint** (+ `oxlint-tsgolint`) | Type-aware linting                                   |
| **Oxfmt**                        | Formatting (import + Tailwind class sort)            |
| **Husky**                        | Git hooks                                            |
| **commitlint**                   | Conventional commit messages                         |
| **lint-staged**                  | Format + lint staged files on commit                 |
| **Knip**                         | Unused files / deps / exports                        |
| **Storybook 10**                 | Design-system stories (`apps/web`)                   |
| **Vitest 5**                     | Unit tests                                           |
| **Playwright**                   | E2E tests                                            |
| **vite-plugin-pwa**              | PWA (Workbox SW + web manifest; RR SPA precache fix) |

Recommended editor extension: `oxc.oxc-vscode` (see `.vscode/extensions.json`).

## Workspace layout

```text
apps/web          CSR SPA (feature-sliced)
apps/api          Node API (modular monolith skeleton)
packages/shared   Shared Zod schemas + locale helpers
```

Shared versions are pinned via `pnpm-workspace.yaml` `catalog` (`typescript`, `zod`, `vitest`, `@types/node`).

## Conventions

- **Feature-sliced design** on the web app (`app` / `pages` / `widgets` / `features` / `entities` / `shared`)
- **kebab-case** file and folder names (`unicorn/filename-case`)
- Every public module lives in a **folder** and re-exports via `index.ts`
- **One public export per `.tsx`** — types / hooks / utils / constants live in sibling `*.types.ts`, `*.hooks.ts`, `*.utils.ts`, `*.constants.ts` (see `.cursor/rules/tsx-single-export.mdc`)
- Fully type-safe — `typescript/no-explicit-any` and unsafe assertions are errors
- Business logic in hooks/utilities; UI stays presentational
- React Router route modules stay thin and compose FSD pages
- Child routes use **`clientLoader` / `clientAction`** (CSR SPA mode)
- Commits follow Conventional Commits (`feat:`, `fix:`, `chore:`, …)

## Prerequisites

- Node.js **22.22+** (React Router 8 requirement; 22.17 shows a warning)
- pnpm 10+
- Docker / OrbStack (for Postgres)

## Setup

```bash
cp .env.example .env
pnpm install
pnpm docker:up
pnpm db:migrate
```

Clerk is linked to the **Closet** Dashboard application. Refresh keys with `npx clerk env pull` (then keep `VITE_CLERK_PUBLISHABLE_KEY` in sync with `CLERK_PUBLISHABLE_KEY`). If keys are missing/placeholders:

- Web runs in **guest mode** (auth screens show a setup hint; shell routes stay explorable)
- API serves `/health` without Clerk; `/v1/*` requires real Clerk keys + Bearer token

## Develop

```bash
pnpm dev          # web (:5173) + api (:8080)
pnpm storybook    # design system on :6006
pnpm check        # fmt + lint + typecheck + test + knip
```

Web proxies `/v1` and `/health` to the API during local development.

## Scripts

| Script                        | Purpose                        |
| ----------------------------- | ------------------------------ |
| `pnpm build`                  | Build shared → api → web       |
| `pnpm typecheck`              | Typecheck all packages         |
| `pnpm lint` / `pnpm lint:fix` | Oxlint (type-aware)            |
| `pnpm fmt` / `pnpm fmt:check` | Oxfmt                          |
| `pnpm test`                   | Unit tests (Vitest)            |
| `pnpm test:e2e`               | Playwright e2e (web)           |
| `pnpm storybook`              | Storybook dev server           |
| `pnpm knip`                   | Unused code / dependency audit |
| `pnpm check`                  | Full quality gate              |
| `pnpm db:migrate`             | Apply migrations               |

## PWA

Web is installable via **vite-plugin-pwa** (Workbox) + **@vite-pwa/assets-generator**.

- Manifest: `apps/web/pwa.manifest.ts` (icons in `public/`; regenerate with `pnpm --filter @closet/web pwa:assets`)
- Service worker: React Router `buildEnd` runs `scripts/fix-pwa-precache.mjs` after SPA `index.html` exists (vite-plugin-pwa alone cannot see it — RR Framework SPA timing)
- Route discovery is `initial` so offline navigation does not depend on lazy `/__manifest`
- Update prompt: `src/features/pwa-reload-prompt`
- Preview: `pnpm --filter @closet/web build && pnpm --filter @closet/web start` (HTTPS or localhost)

## Design system

MD3-inspired tokens live in `apps/web/src/app/styles/tokens.css` with a green primary seed. Primitives are under `apps/web/src/shared/ui` with Storybook coverage for Button and Chip to start.

## Next milestones

See the product PRD: wardrobe upload, outfit engine, weather, stylist chat, and Discover shopping are intentionally out of this foundation.
