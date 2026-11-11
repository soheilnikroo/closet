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

With real Clerk keys, onboarding and shell routes require sign-in. After auth, users return to the page they wanted (or `/today`). Already-signed-in visits to `/sign-in` / `/sign-up` redirect into the app; SSO callback refresh does the same if a session already exists.

In the Clerk Dashboard → **Paths / Redirects**, allow:

- `http://localhost:5173/sso-callback`
- `http://localhost:5173/sign-in/sso-callback`
- `http://localhost:5173/sign-up/sso-callback`

(and the `127.0.0.1` variants if you browse that host). Locally prefer empty `VITE_API_BASE_URL` so the Vite `/v1` proxy avoids CORS.

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

## Release 1 product surface

End-to-end MVP is implemented on this foundation:

- Onboarding (skippable style + city → add clothes / sample catalog → first outfit + feedback)
- My Closet (photo upload + mock/OpenAI vision → confirm → CRUD)
- Today (deterministic outfit engine, weather via Open-Meteo/mock, like/dislike/save/regenerate)
- Contextual stylist chat (intent parsing + wardrobe-only recommendations)
- Discover wardrobe gaps and saved sample product ideas (no store scraping)

### Optional integrations

| Capability    | Env                                             | Fallback                               |
| ------------- | ----------------------------------------------- | -------------------------------------- |
| Vision / LLM  | `OPENAI_API_KEY` (+ optional `OPENAI_BASE_URL`) | Deterministic mock providers           |
| Weather       | `WEATHER_PROVIDER=open-meteo`                   | `mock` fixed snapshot / test mode      |
| Media storage | `LOCAL_STORAGE_DIR` (default) or `S3_*`         | Local filesystem under `.data/storage` |

Product APIs under `/v1/*` still require real Clerk keys. Seeds (Iran cities, clothing categories, occasions) run on API boot.


## Complete mock-first experience

Use Node 24+ and pnpm. Copy `.env.example` to `.env`, then run:

```sh
pnpm install
pnpm docker:up
pnpm db:migrate
pnpm dev:mock
```

Open the web URL and choose **Try a ready-made closet**. This creates a local demo
profile, selects Tehran if no city was chosen, and adds 12 sample garments without
removing your clothes. Repeating it reuses existing active sample garments.
You can also start empty, add photos or enter garments in four short steps.

Today and stylist chat support feedback, swapping a garment, and an illustrated
outfit preview. Discover offers a local sample catalog matched to wardrobe gaps,
with saved ideas and a shortcut for adding similar clothes you own. You contains
city, language, units, style, fit, comfort, optional height, and preview settings.
Preferences persist in PostgreSQL. Height is recorded for future styling work;
it does not currently change scoring. Notification preferences are reserved; no
notifications are sent. The try-on preview draws garment colours on a mannequin;
it is not photographic try-on or an estimate of fit.

| Mode | API authentication | Web authentication | AI | Weather |
| --- | --- | --- | --- | --- |
| All mock (local / CI) | `AUTH_PROVIDER=mock` | `VITE_AUTH_PROVIDER=mock` | `AI_PROVIDER=mock` | `WEATHER_PROVIDER=mock` |
| Hybrid local | mock or Clerk | match API provider | mock or OpenAI + key | mock or open-meteo |
| Production | `AUTH_PROVIDER=clerk`, real Clerk keys | `VITE_AUTH_PROVIDER=clerk`, matching publishable key | selected provider | selected provider |

With AUTH_PROVIDER unset, placeholder / missing Clerk keys select mock mode only
outside production. Mock requests use `Authorization: Bearer mock:dev-user`.
Use a different `mock:<id>` for an isolated local test user. Mock identities are
not authentication: keep the demo API local. Production refuses mock auth and
requires real Clerk keys. `POST /v1/demo/seed` is available only in mock-auth mode.
Shopping and `TRYON_PROVIDER=mock` previews are local mocks in all modes.
Storage remains local disk. No S3, payments, scraping or external try-on service.

The PWA caches its shell/assets; wardrobe data, settings, and recommendations
still require the running API and database. The mock weather is deterministic
for a city and month and is not a real forecast. Vision uses image bytes to select
sample garments; always review detections before saving.

Validation: `pnpm check`, `pnpm build`, `pnpm test:e2e`.
Run the optional real mock-auth funnel with `CLOSET_LIVE_E2E=1 pnpm test:e2e`
after starting the API with mock providers on port 8080 and migrating the DB.
