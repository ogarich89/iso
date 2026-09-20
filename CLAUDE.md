# CLAUDE.md

Guidance for working in this repository.

## What this is

`iso` is a from-scratch isomorphic (SSR) React starter framework — not an app. A Fastify server renders React on each request, serializes state into the HTML, and the client hydrates it. Vite provides the build and, in development, runs inside Fastify as middleware.

## Tech stack

- **Runtime / package manager** — [Bun](https://bun.sh) ≥1.4 runs the server, the build, the tests and the scripts; Node.js is not a dependency
- **Language** — TypeScript 7 (`tsc --noEmit` for checking; Vite/SWC for transforms)
- **Server** — Fastify 5 (`@fastify/cookie`, `@fastify/session`, `@fastify/static`, `@fastify/middie`)
- **UI** — React 19, React Router 8, react-i18next 17 / i18next 26
- **Server state** — TanStack Query 5 (`@tanstack/react-query`)
- **UI state** — Zustand 5
- **Validation** — Zod 4 (`zod` on the server and in config, `zod/mini` in shared code that ships to the browser)
- **Build / dev server** — Vite 8 (`@vitejs/plugin-react`, `vite-plugin-svgr`), SSR in middleware mode
- **Styles** — SCSS (`sass-embedded`) + CSS Modules; PostCSS (`autoprefixer`, `cssnano`, `postcss-import`, `postcss-combine-media-query`, and `@fullhuman/postcss-purgecss` in production)
- **Icons** — `lucide-react`; local SVGs via SVGR (`?react`)
- **Sessions** — `ioredis` + `connect-redis` (optional)
- **HTTP / monitoring** — `axios`, `@fastify/http-proxy`, `@fastify/helmet`, `@sentry/bun`
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
    queries.ts                                                         (queryOptions for the domain)
    types.ts                                                          (zod schemas + inferred types)
    components/{atoms,molecules,organisms}/                            (domain UI, atomic design)
  components/{atoms,molecules,organisms}/                              (shared cross-domain UI: Link, Loading, Modal)
  lib/         api/, session/, query.ts, route.tsx, lazyWithPreload.tsx, dom.ts, url.ts
  store/       ui.ts (client-only modal store)
  styles/      variables.scss, mixins.scss                            (aliases: `variables`, `mixins`)
  types/       index.ts, global.d.ts
  assets/icons/
server/        index.mjs, register.mjs, routes.mjs, routes/, handlers/, renderer/{index,styles,template}.mjs
config/        index.mjs (env config), i18n.mjs (i18next options), vitest.setup.ts
.claude/skills/  tdd/, generate-code/, onboarding/, github/          (see the Skills section)
```

## Architecture

- **Server** (`server/`, plain `.mjs`): `index.mjs` boots Fastify and delegates SSR to `createRenderer` from `server/renderer/`. The renderer, in dev, creates a Vite dev server, mounts `vite.middlewares`, loads the SSR entry via `vite.ssrLoadModule`, and inlines the module-graph CSS (`server/renderer/styles.mjs` — the standard Vite dev-SSR style collector); in prod it reads the built template, `ssr-manifest.json` and `dist/server/server.js`. `register.mjs` wires helmet, cookies, sessions (optionally Redis), the `/api` proxy and static files (`/public` for an hour, hashed `/assets` for a year, immutable). The `*` route renders SSR; other routes (e.g. `POST /session/language`) come from `routes.mjs`.
- **SSR entry** (`src/app/server.tsx`): `render(url, { manifest, cookie, lng })` creates a per-request `QueryClient`, preloads the matched route's lazy modules, runs its `prefetch`es with the params from `matchPath`, renders to string and serialises `dehydrate(queryClient)` into `window.__QUERY_STATE__`. Returns `{ appHtml, preloadLinks, state }`, injected into `index.html`'s `<!--app-*-->` placeholders.
- **Client entry** (`src/app/client.tsx`): inits i18next from serialized data, preloads the current route's chunks, then `hydrateRoot` inside a `QueryClientProvider` and a `HydrationBoundary` fed with `window.__QUERY_STATE__`, so the server's cache becomes the client's cache.
- **Server state** (`src/lib/query.ts`, `src/modules/<domain>/queries.ts`): TanStack Query. `createQueryClient` sets the shared defaults (60s `staleTime`, no retry, no refetch on focus) and is used by both entries. A domain exports `queryOptions` factories; a route prefetches them on the server and a page reads the same options with `useQuery`, so the key is written once. A query function returns `null` on failure, which keeps the not-found path renderable on the server — an errored query is not dehydrated.
- **Routing** (`src/app/routes.ts`, `src/lib/route.tsx`): routes map a `layout` + `page` name to lazy components discovered via `import.meta.glob`, resolved by file name, and carry an optional `prefetch(queryClient, { params, req })`. `src/lib/lazyWithPreload.tsx` wraps `React.lazy` with a `.preload()` used by both SSR and client; once preloaded it renders the module **synchronously** instead of suspending, which is what keeps `renderToString` from degrading to a client render. Both entries preload the catch-all `*` route too, so 404s are server-rendered.
- **API** (`src/lib/api/`): in the browser `request` calls `/api/...` on this server, which `@fastify/http-proxy` forwards upstream with the `x-api-key` header and without our session cookie; during SSR it calls the upstream host directly. The split is `import.meta.env.SSR`, so the key and the upstream host are compiled out of the client bundle. `request(method, schema, data, params?, req?)` unwraps the `{ data }` envelope and parses it with the domain's `zod/mini` schema, so a response that breaks the contract is logged and rejected instead of reaching a component; `methods.ts` is the endpoint registry. `shared` is domain-agnostic — domains pass their own schemas.
- **Config** (`config/index.mjs`): server-only, parses `process.env` through a zod schema (`parseConfig`), so a bad value fails at boot with the variable named. Shared code reads only `import.meta.env.VITE_API` / `VITE_API_KEY` / `VITE_PORT`, injected by Vite `define`. `vite.config.ts` merges `.env` / `.env.local` into `process.env` (real env wins) before reading the config, so builds see the same values as `bun dev`.
- **Testing**: Vitest + Testing Library in jsdom, tests colocated as `X.test.tsx` next to the code and typechecked with it. Page and query tests mock `src/lib/api/request` and drive a real `QueryClient`. `config/vitest.setup.ts` mocks `react-i18next` (`t` returns the key) and stubs `window.scrollTo`. `src/app/server.test.tsx` asserts on real SSR output and `src/app/client.test.tsx` hydrates that output, so both SSR degradation and hydration mismatches fail the suite. Follow `.claude/skills/tdd/SKILL.md` — test first.

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

- The `QueryClient` is per-request on the server — never module-level mutable app state. `src/store/ui.ts` is a module-level store on purpose: it is client-only.
- `SESSION_SECRET` (32+ characters) is required to boot; the build does not need it, so CI stays green without secrets.
- The production CSP is nonce-based: `render(url, { nonce })` stamps the two state scripts, and the nonce comes from `@fastify/helmet`'s `enableCSPNonces`. A style nonce disables `'unsafe-inline'`, so `style-src-attr 'unsafe-inline'` is set explicitly for React's inline `style` attributes, and SVG assets must not carry a `<style>` block — use presentation attributes.
- Session cookies are `secure: 'auto'`, so behind a TLS-terminating proxy `TRUST_PROXY=true` is required or the cookie is never marked `Secure`.
- Shared code uses `zod/mini`, not `zod`: the classic API costs ~23KB gzipped in the client bundle against ~4.5KB for mini.
- `import.meta.glob` for layouts excludes `*.test.tsx`; without that, a layout test is discovered as a layout and bundled into `dist/`.
- SSR renders real content because route modules are preloaded before `renderToString`; keep new lazy routes reachable through `expandRoutes`.
- Config is env-based: defaults in committed `.env`, local overrides in `.env.local` (gitignored, holds `SESSION_SECRET` and `API_KEY`). Bun loads `.env` and `.env.local` itself, so the scripts pass no env flags. The demo backend (reqres.in) rejects requests without `x-api-key`, which `src/lib/api/request.ts` sends from `VITE_API_KEY` — note that this ships in the client bundle, so it is fine for a demo key and wrong for a real secret.
- PurgeCSS runs in the **production build only**, with a kebab-aware extractor so CSS-Module classes (JS `style.closeBtn` ↔ CSS `.close-btn`) survive.
- Knip is configured in `knip.json`; `pino-pretty` and `postcss-scss` are string-referenced (Fastify transport / stylelint flag) and listed under `ignoreDependencies`.
