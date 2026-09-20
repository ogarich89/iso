# CLAUDE.md

Guidance for working in this repository.

## What this is

`iso` is a from-scratch isomorphic (SSR) React starter framework — not an app. A Fastify server renders React on each request, serializes state into the HTML, and the client hydrates it. Vite provides the build and, in development, runs inside Fastify as middleware.

## Tech stack

- **Runtime / package manager** — [Bun](https://bun.sh) ≥1.4 runs the server, the build, the tests and the scripts; Node.js is not a dependency
- **Language** — TypeScript 7 (`tsc --noEmit` for checking; Vite/SWC for transforms)
- **Server** — Fastify 5 (`@fastify/cookie`, `@fastify/session`, `@fastify/static`, `@fastify/middie`)
- **UI** — React 19, React Router 8, react-i18next 17 / i18next 26
- **State** — Zustand 5
- **Build / dev server** — Vite 8 (`@vitejs/plugin-react`, `vite-plugin-svgr`), SSR in middleware mode
- **Styles** — SCSS (`sass-embedded`) + CSS Modules; PostCSS (`autoprefixer`, `cssnano`, `postcss-import`, `postcss-combine-media-query`, and `@fullhuman/postcss-purgecss` in production)
- **Icons** — `lucide-react`; local SVGs via SVGR (`?react`)
- **Sessions** — `ioredis` + `connect-redis` (optional)
- **HTTP / monitoring** — `axios`, `@sentry/bun`
- **Testing** — Vitest 5 + Testing Library + jsdom
- **Lint / format** — Biome 2.5 (JS/TS), Stylelint 17 (SCSS)
- **Dead code** — Knip 6

## Commands

Package manager and runner is **bun**.

- `bun dev` — one process: Fastify + SSR + Vite dev server (client bundling + HMR) in middleware mode. Serves http://localhost:3000
- `bun run build` — builds the Vite client bundle (`dist/client`, with `.vite/ssr-manifest.json`) and the SSR bundle (`dist/server/server.js`)
- `bun start` — production server (expects a prior `bun run build`)
- `bun run serve` — build then start
- `bun run test` — Vitest (`--coverage`); a single file with `bunx vitest run <file>`. Note `bun test` (no `run`) starts Bun's own runner and fails
- `bun run typecheck` — `tsc --noEmit`
- `bun run lint` — Biome (lint + format check); `bun run format` writes formatting
- `bun run stylelint` — SCSS lint
- `bun run deadcode` — Knip (unused files/exports/deps)

`pre-commit` runs `test`, `typecheck`, `lint`, `stylelint`, `deadcode`.

## Directory structure

```
src/
  app/         App.tsx, routes.ts, App.scss, client.tsx, server.tsx   (app shell + SSR/CSR entries)
  layouts/     main.tsx                                               (glob: /src/layouts/*.tsx, tests excluded)
    components/{atoms,molecules}/                                      (layout-only UI: Logo, Header, Navigation, LanguageSwitch)
  modules/<domain>/                                                    (domains: home, products, not-found)
    *.page.tsx                                                         (glob: /src/modules/**/*.page.tsx)
    store/                                                             (domain actions; augments shared State)
    types.ts                                                          (domain types)
    components/{atoms,molecules,organisms}/                            (domain UI, atomic design)
  components/{atoms,molecules,organisms}/                              (shared cross-domain UI: Link, Loading, Modal)
  lib/         api/, session/, route.tsx, lazyWithPreload.tsx, dom.ts, url.ts
  hooks/       useInitialState.ts
  store/       index.ts (augmentable State + context), ui.ts (client-only modal store)
  styles/      variables.scss, mixins.scss                            (aliases: `variables`, `mixins`)
  types/       index.ts, global.d.ts
  assets/icons/
server/        index.mjs, register.mjs, routes.mjs, routes/, handlers/, renderer/{index,styles,template}.mjs
config/        index.mjs (env config), i18n.mjs (i18next options), vitest.setup.ts
.claude/skills/  tdd/, generate-code/, onboarding/, github/          (see the Skills section)
```

## Architecture

- **Server** (`server/`, plain `.mjs`): `index.mjs` boots Fastify and delegates SSR to `createRenderer` from `server/renderer/`. The renderer, in dev, creates a Vite dev server, mounts `vite.middlewares`, loads the SSR entry via `vite.ssrLoadModule`, and inlines the module-graph CSS (`server/renderer/styles.mjs` — the standard Vite dev-SSR style collector); in prod it reads the built template, `ssr-manifest.json` and `dist/server/server.js`. `register.mjs` wires cookies, sessions (optionally Redis), and static `/public` (+ `/assets` in prod). The `*` route renders SSR; other routes (e.g. `POST /session/language`) come from `routes.mjs`.
- **SSR entry** (`src/app/server.tsx`): `render(url, { manifest, cookie, lng })` preloads the matched route's lazy modules, runs its `initialAction`s against a first store, then **re-creates the store seeded with the collected state** and renders to string — zustand serves `getInitialState()` as the server snapshot, so state set after creation is invisible to SSR. Returns `{ appHtml, preloadLinks, state }`, injected into `index.html`'s `<!--app-*-->` placeholders.
- **Client entry** (`src/app/client.tsx`): inits i18next from serialized data, preloads the current route's chunks, then `hydrateRoot`.
- **State** (`src/store/`): Zustand. `createAppStore` makes a fresh vanilla store per request, provided via `StoreContext`. `State` is an **augmentable registry interface** — each domain adds its slice with `declare module 'src/store'`. Domain actions (`src/modules/<domain>/store/*.ts`) are plain functions `(store, req?) => void` used as route `initialAction`s. `store/ui.ts` is a client-only modal store.
- **Routing** (`src/app/routes.ts`, `src/lib/route.tsx`): routes map a `layout` + `page` name to lazy components discovered via `import.meta.glob`, resolved by file name. `src/lib/lazyWithPreload.tsx` wraps `React.lazy` with a `.preload()` used by both SSR and client; once preloaded it renders the module **synchronously** instead of suspending, which is what keeps `renderToString` from degrading to a client render. Both entries preload the catch-all `*` route too, so 404s are server-rendered.
- **API** (`src/lib/api/`): `request<T>(method, data, params?, req?)` is generic over the response type; `methods.ts` is the endpoint registry. `shared` is domain-agnostic — domains pass their own types.
- **Config** (`config/index.mjs`): server-only, parses `process.env`. Shared code reads only `import.meta.env.VITE_API` / `VITE_API_KEY` / `VITE_PORT`, injected by Vite `define`. `vite.config.ts` merges `.env` / `.env.local` into `process.env` (real env wins) before reading the config, so builds see the same values as `bun dev`.
- **Testing**: Vitest + Testing Library in jsdom, tests colocated as `X.test.tsx` next to the code and typechecked with it. `config/vitest.setup.ts` mocks `react-i18next` (`t` returns the key) and stubs `window.scrollTo`. `src/app/server.test.tsx` asserts on real SSR output and `src/app/client.test.tsx` hydrates that output, so both SSR degradation and hydration mismatches fail the suite. Follow `.claude/skills/tdd/SKILL.md` — test first.

## Skills (`.claude/skills/`)

- **tdd** — the test-first loop, the commands, and recipes for component/page/action/SSR/hydration tests.
- **generate-code** — how to write a new component, page, domain, stylesheet or endpoint in this repo's
  conventions; `references/` holds the templates and the design tokens.
- **onboarding** — guided tour for a developer new to the repo.
- **github** — commit message convention, branching, pull requests.

## Code style

- **Formatting/linting is Biome** — single quotes, double JSX quotes, width 120. Run `bun run format`. Stylelint covers SCSS.
- **No explanatory comments** — code must be self-explanatory.
- **Absolute imports** from `src/`; Biome forbids `../` parent-relative imports outside `server/` and `config/`.
- **Atomic design** — `{atoms,molecules,organisms}` under whichever owner the component belongs to: `src/components/`, `src/layouts/components/`, or `src/modules/<domain>/components/`.
- **Pages** are `*.page.tsx` inside their module, referenced by name in `src/app/routes.ts`.
- **Layering** — a domain owns its types (`src/modules/<domain>/types.ts`) and its slice of `State` (via `declare module 'src/store'`); `shared` (store/types/lib) never imports from `modules`. UI lives with its only consumer: layout chrome under `src/layouts/components/`, domain UI under the module, and `src/components/` only for what more than one of them uses. `PageNotFound` belongs to `not-found` and is reused by the products pages.
- **Styles** — CSS Modules `X.module.scss` (camelCase locals) imported as `import style from './X.module.scss'`; globals in `src/app/App.scss`; design tokens in `src/styles/` via `@use "variables"` / `@use "mixins"`.
- **Icons/SVGs** — prefer `lucide-react`; local SVGs use the `?react` suffix (SVGR).

## Gotchas

- The store is per-request on the server — never module-level mutable app state.
- `import.meta.glob` for layouts excludes `*.test.tsx`; without that, a layout test is discovered as a layout and bundled into `dist/`.
- SSR renders real content because route modules are preloaded before `renderToString`; keep new lazy routes reachable through `expandRoutes`.
- Config is env-based: defaults in committed `.env`, local overrides in `.env.local` (gitignored, holds `SESSION_SECRET` and `API_KEY`). Bun loads `.env` and `.env.local` itself, so the scripts pass no env flags. The demo backend (reqres.in) rejects requests without `x-api-key`, which `src/lib/api/request.ts` sends from `VITE_API_KEY` — note that this ships in the client bundle, so it is fine for a demo key and wrong for a real secret.
- PurgeCSS runs in the **production build only**, with a kebab-aware extractor so CSS-Module classes (JS `style.closeBtn` ↔ CSS `.close-btn`) survive.
- Knip is configured in `knip.json`; `pino-pretty` and `postcss-scss` are string-referenced (Fastify transport / stylelint flag) and listed under `ignoreDependencies`.
