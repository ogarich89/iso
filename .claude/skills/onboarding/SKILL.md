---
name: onboarding
description: Guided tour of the iso codebase for a developer new to it — how a request flows, where code lives, and the recipes for the usual first tasks (add a page, a domain, an endpoint, a component, a translation). Use when someone asks how this project works, where something lives, how to get started or set up, or /onboarding.
---

# Onboarding to `iso`

`iso` is a **starter framework**, not an application. The products/home pages are demo content — expect to
delete them. Everything below is what a newcomer needs before their first change; `CLAUDE.md` is the
reference, this is the path through it.

When guiding someone, verify their setup first, then trace a request with them, then hand them the recipe for
the task they actually came for. Read the files you talk about rather than quoting this page from memory —
if anything here disagrees with the code, the code wins and this skill needs fixing.

## 1. Setup check

```sh
bun -v           # 1.4+, and the only runtime needed — the server, build and tests all run on Bun
bun install
```

`.env` is committed with defaults; secrets go in `.env.local` (gitignored), which Bun loads automatically. It needs at least:

```sh
SESSION_SECRET=<random string>
API_KEY=<reqres.in key>   # the demo backend rejects requests without x-api-key
```

`bun dev` then serves http://localhost:3000 — one process running Fastify, SSR and Vite in middleware mode.
A page that renders but never hydrates is almost always a missing `.env.local`.

## 2. Trace one request

Follow a request for `/products` in this order — it is the fastest way to understand the whole design:

1. `server/index.mjs` boots Fastify; `server/register.mjs` adds cookies, sessions and static files;
   `server/routes.mjs` holds real endpoints; everything else falls through to the `*` SSR route.
2. `server/renderer/index.mjs` loads the SSR entry (in dev via `vite.ssrLoadModule`, in prod from
   `dist/server/server.js`) and fills the `<!--app-html-->`, `<!--app-preload-links-->` and `<!--app-state-->`
   placeholders in `index.html`.
3. `src/app/server.tsx` matches the URL against `expandRoutes(routes)`, preloads the matched lazy modules,
   runs their `prefetch`es against a per-request `QueryClient`, renders to string, and serialises
   `dehydrate(queryClient)` into the page.
4. The browser loads `src/app/client.tsx`: it hydrates that cache through `HydrationBoundary`, preloads the
   same modules, and calls `hydrateRoot`.
5. On later navigation there is no server round-trip — `useQuery` serves the cache and fetches only what is
   missing or stale.

The whole framework hangs on step 3 and 4 doing the *same* work, so the markup matches.

## 3. The map

| Where | What |
| --- | --- |
| `src/app/` | shell, route table, SSR and client entries |
| `src/layouts/` | layouts (`main.tsx`) and the chrome only they use (`components/`) |
| `src/modules/<domain>/` | a feature: pages, its queries, its schemas and types, its components |
| `src/components/` | UI shared across domains — `Link`, `Loading`, `Modal` |
| `src/lib/` | plumbing: api, session, routing helpers, `lazyWithPreload`, dom, url |
| `src/store/` | `ui.ts`, the client-only modal store (server data lives in TanStack Query) |
| `server/` | plain `.mjs` Fastify server, renderer and endpoints |
| `config/` | env config, i18next options, vitest setup |

Three rules decide where new code goes: a domain owns its types and its slice of `State`; shared code never
imports from `modules`; a component lives with its only consumer and moves to `src/components/` when a second
one appears.

## 4. Recipes

**Add a page.** Create `src/modules/<domain>/<name>.page.tsx` (default export), then reference it by file name
in `src/app/routes.ts`. Pages are discovered by `import.meta.glob`, so the file name *is* the key.

**Add a domain.** `src/modules/<domain>/` with `types.ts` (zod schemas plus inferred types), `queries.ts` and
`components/`.

**Load data for a route.** Export a `queryOptions` factory from the domain's `queries.ts`, prefetch it on the
route (`prefetch: (queryClient, { params, req }) => queryClient.prefetchQuery(...)`), and read the same
options in the page with `useQuery`. A failed request resolves to `null`, which the page renders as
"not found".

**Call a new endpoint.** Add it to `src/lib/api/methods.ts`, then `request('example', exampleSchema, data)`.
The response is validated against the schema, and the `x-api-key` header and API host come from env.

**Add a server endpoint.** A route file in `server/routes/`, a handler in `server/handlers/`, then export it
from `server/routes.mjs`. `POST /session/language` is the worked example, including its JSON schema.

**Add a translation.** Keys live in `public/locales/{en,ru}/translation.json`; read them with
`const { t } = useTranslation()`. Adding a language means `LANGUAGES` in `config/i18n.mjs` plus a flag icon in
`src/layouts/components/molecules/LanguageSwitch/`.

**Add a component.** Atomic design under its owner, CSS Modules beside it (`X.module.scss`, camelCase locals),
tokens via `@use "variables"` / `@use "mixins"`.

## 5. Before pushing

`bun run test`, `bun run typecheck`, `bun run lint`, `bun run stylelint`, `bun run deadcode` — `pre-commit`
runs all five. Tests come first, not last: see `.claude/skills/tdd/SKILL.md`.

## 6. What bites newcomers

- `bun test` is Bun's runner and fails; the project's suite is `bun run test`.
- No explanatory comments — naming carries the meaning.
- Absolute `src/...` imports only; Biome rejects `../` outside `server/` and `config/`.
- Never hold app state in a module-level variable: on the server one process serves every user. The
  `QueryClient` is created per request for exactly that reason.
- A new lazy route must be reachable through `expandRoutes`, or it will not be preloaded and SSR will fall
  back to client rendering for it.
- PurgeCSS only runs in the production build, so a class that works in `bun dev` can still vanish from
  `bun run build` — check there before shipping CSS that is built dynamically.
