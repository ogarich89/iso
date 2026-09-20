# CLAUDE.md

Guidance for working in this repository.

## What this is

`iso` is a from-scratch isomorphic (SSR) React starter framework — not an app. A Fastify server renders React on each request, serializes state into the HTML, and the client hydrates it. Vite provides the build and, in development, runs inside Fastify as middleware.

## Tech stack

- **Runtime / package manager** — Node ≥20, [Bun](https://bun.sh) (installs deps and runs scripts)
- **Language** — TypeScript 7 (`tsc --noEmit` for checking; Vite/SWC for transforms)
- **Server** — Fastify 5 (`@fastify/cookie`, `@fastify/session`, `@fastify/static`, `@fastify/middie`)
- **UI** — React 19, React Router 8, react-i18next 17 / i18next 26
- **State** — Zustand 5
- **Build / dev server** — Vite 8 (`@vitejs/plugin-react`, `vite-plugin-svgr`), SSR in middleware mode
- **Styles** — SCSS (`sass-embedded`) + CSS Modules; PostCSS (`autoprefixer`, `cssnano`, `postcss-import`, `postcss-combine-media-query`, and `@fullhuman/postcss-purgecss` in production)
- **Icons** — `lucide-react`; local SVGs via SVGR (`?react`)
- **Sessions** — `ioredis` + `connect-redis` (optional)
- **HTTP / monitoring** — `axios`, `@sentry/node`
- **Testing** — Vitest 5 + Testing Library + jsdom
- **Lint / format** — Biome 2.5 (JS/TS), Stylelint 17 (SCSS)
- **Dead code** — Knip 6

## Commands

Package manager and runner is **bun**.

- `bun dev` — one process: Fastify + SSR + Vite dev server (client bundling + HMR) in middleware mode. Serves http://localhost:3000
- `bun run build` — builds the Vite client bundle (`dist/client`, with `.vite/ssr-manifest.json`) and the SSR bundle (`dist/server/server.js`)
- `bun start` — production server (expects a prior `bun run build`)
- `bun run serve` — build then start
- `bun test` — Vitest (`--coverage`)
- `bun run typecheck` — `tsc --noEmit`
- `bun run lint` — Biome (lint + format check); `bun run format` writes formatting
- `bun run stylelint` — SCSS lint
- `bun run deadcode` — Knip (unused files/exports/deps)

`pre-commit` runs `test`, `typecheck`, `lint`, `stylelint`, `deadcode`.

## Directory structure

```
src/
  app/         App.tsx, routes.ts, App.scss, client.tsx, server.tsx   (app shell + SSR/CSR entries)
  layouts/     main.tsx                                               (glob: /src/layouts/*.tsx)
  modules/<domain>/                                                    (domains: home, products, not-found)
    *.page.tsx                                                         (glob: /src/modules/**/*.page.tsx)
    store/                                                             (domain actions; augments shared State)
    types.ts                                                          (domain types)
    components/{atoms,molecules,organisms}/                            (domain UI, atomic design)
  components/{atoms,molecules,organisms}/                              (shared cross-domain UI, atomic design)
  lib/         api/, session/, route.tsx, lazyWithPreload.tsx, dom.ts, url.ts
  hooks/       useInitialState.ts
  store/       index.ts (augmentable State + context), ui.ts (client-only modal store)
  styles/      variables.scss, mixins.scss                            (aliases: `variables`, `mixins`)
  types/       index.ts, global.d.ts
  assets/icons/
server/        index.mjs, register.mjs, routes.mjs, routes/, handlers/, renderer/{index,styles,template}.mjs
config/        index.mjs (env config), i18n.mjs (i18next options), vitest.setup.ts
```

## Architecture

- **Server** (`server/`, plain `.mjs`): `index.mjs` boots Fastify and delegates SSR to `createRenderer` from `server/renderer/`. The renderer, in dev, creates a Vite dev server, mounts `vite.middlewares`, loads the SSR entry via `vite.ssrLoadModule`, and inlines the module-graph CSS (`server/renderer/styles.mjs` — the standard Vite dev-SSR style collector); in prod it reads the built template, `ssr-manifest.json` and `dist/server/server.js`. `register.mjs` wires cookies, sessions (optionally Redis), and static `/public` (+ `/assets` in prod). The `*` route renders SSR; other routes (e.g. `POST /session/language`) come from `routes.mjs`.
- **SSR entry** (`src/app/server.tsx`): `render(url, { manifest, cookie, lng })` creates a per-request store, preloads the matched route's lazy modules, runs its `initialAction`s, renders to string, and builds preload links from the SSR manifest. Returns `{ appHtml, preloadLinks, state }`, injected into `index.html`'s `<!--app-*-->` placeholders.
- **Client entry** (`src/app/client.tsx`): inits i18next from serialized data, preloads the current route's chunks, then `hydrateRoot`.
- **State** (`src/store/`): Zustand. `createAppStore` makes a fresh vanilla store per request, provided via `StoreContext`. `State` is an **augmentable registry interface** — each domain adds its slice with `declare module 'src/store'`. Domain actions (`src/modules/<domain>/store/*.ts`) are plain functions `(store, req?) => void` used as route `initialAction`s. `store/ui.ts` is a client-only modal store.
- **Routing** (`src/app/routes.ts`, `src/lib/route.tsx`): routes map a `layout` + `page` name to lazy components discovered via `import.meta.glob`, resolved by file name. `src/lib/lazyWithPreload.tsx` wraps `React.lazy` with a `.preload()` used by both SSR and client.
- **API** (`src/lib/api/`): `request<T>(method, data, params?, req?)` is generic over the response type; `methods.ts` is the endpoint registry. `shared` is domain-agnostic — domains pass their own types.
- **Config** (`config/index.mjs`): node-only, parses `process.env`. Shared code reads only `import.meta.env.VITE_API` / `VITE_PORT`, injected by Vite `define`.

## Code style

- **Formatting/linting is Biome** — single quotes, double JSX quotes, width 120. Run `bun run format`. Stylelint covers SCSS.
- **No explanatory comments** — code must be self-explanatory.
- **Absolute imports** from `src/`; Biome forbids `../` parent-relative imports outside `server/` and `config/`.
- **Atomic design** — shared UI in `src/components/{atoms,molecules,organisms}`; domain UI in `src/modules/<domain>/components/{atoms,molecules,organisms}`.
- **Pages** are `*.page.tsx` inside their module, referenced by name in `src/app/routes.ts`.
- **Layering** — a domain owns its types (`src/modules/<domain>/types.ts`) and its slice of `State` (via `declare module 'src/store'`); `shared` (store/types/lib) never imports from `modules`.
- **Styles** — CSS Modules `X.module.scss` (camelCase locals) imported as `import style from './X.module.scss'`; globals in `src/app/App.scss`; design tokens in `src/styles/` via `@use "variables"` / `@use "mixins"`.
- **Icons/SVGs** — prefer `lucide-react`; local SVGs use the `?react` suffix (SVGR).

## Gotchas

- The store is per-request on the server — never module-level mutable app state.
- SSR renders real content because route modules are preloaded before `renderToString`; keep new lazy routes reachable through `expandRoutes`.
- Config is env-based: defaults in committed `.env`, local overrides in `.env.local` (gitignored, holds `SESSION_SECRET`). The Node server is launched with `--env-file-if-exists`.
- PurgeCSS runs in the **production build only**, with a kebab-aware extractor so CSS-Module classes (JS `style.closeBtn` ↔ CSS `.close-btn`) survive.
- Knip is configured in `knip.json`; `pino-pretty` and `postcss-scss` are string-referenced (Fastify transport / stylelint flag) and listed under `ignoreDependencies`.
