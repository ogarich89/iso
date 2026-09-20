---
name: generate-code
description: Generates new code in this repo's own conventions — components, pages, domains, store actions, API methods, server routes and their SCSS. Reads the existing utilities and design tokens first so generated code reuses them instead of reinventing. Use when asked to add, create, scaffold or generate any file under src/ or server/, or when a change needs a new component, page, module, endpoint or stylesheet.
---

# Generating code for `iso`

This repo is uniform on purpose: every component, page and stylesheet follows the same shape. Generated code
that deviates is worse than no code, because the deviation spreads. Copy the nearest existing file's shape
before inventing one.

## Route to the right reference

Read the one file that covers what you are generating — they are self-contained:

| Generating | Read |
| --- | --- |
| A component (+ its SCSS) | [references/component.md](references/component.md) |
| A page, a whole domain, a store action, route wiring | [references/module.md](references/module.md) |
| Any stylesheet — tokens, mixins, the responsive ladder | [references/styles.md](references/styles.md) |
| An API method, a Fastify route or handler, session access | [references/backend.md](references/backend.md) |

Tests are not optional and not an afterthought: `.claude/skills/tdd/SKILL.md` has the loop and the per-kind
test templates. Write the failing test before the file it covers.

## Non-negotiables

- **No comments.** Naming carries the meaning. This applies to generated files too.
- **Absolute imports** from `src/`; Biome rejects `../` outside `server/` and `config/`.
- **One concern per file**, named after the file: `Card.tsx` exports `Card`, `Card.module.scss` styles it.
- **Named exports for components**, default export for pages and layouts (the route glob resolves them by
  file name, so the file name is the public API).
- **Typed with `FunctionComponent`** and an explicit props interface when there are props.
- **Nothing mutable at module scope** — the server process is shared by every request.
- Biome settings are not yours to reinterpret: single quotes, double JSX quotes, width 120, 2 spaces. Run
  `bun run format` rather than hand-aligning.

## Reuse before writing

Check this list before adding a helper — most "new" utilities already exist:

| Need | Use | From |
| --- | --- | --- |
| Internal link (preloads its route on hover) | `<Link to="/x">` | `src/components/molecules/Link/Link` |
| Loading state | `<Loading timeout={500} />` | `src/components/molecules/Loading/Loading` |
| Not-found state | `<PageNotFound />` | `src/modules/not-found/components/molecules/PageNotFound/PageNotFound` |
| Conditional class names | `cx('container', style.x)` | `classnames` |
| Route data on both server and client | `useQuery(domainQuery(...))` + a route `prefetch` | `@tanstack/react-query`, `src/modules/<domain>/queries.ts` |
| A configured query client | `createQueryClient()` | `src/lib/query` |
| Modal open/close | `useModalStore` | `src/store/ui` |
| HTTP call to the backend | `request('method', schema, data, params?, req?)` | `src/lib/api/request` |
| Session read/write from the client | `session.get` / `session.set` | `src/lib/session` |
| Build a URL or path with params | `pathResolver(...)`, `isExternal(url)` | `src/lib/url` |
| Lock the page behind an overlay | `setOverflow(isShown)` | `src/lib/dom` |
| Lazy component with SSR preloading | `lazyWithPreload(loader)` | `src/lib/lazyWithPreload` |
| Runtime validation in shared code | `import * as z from 'zod/mini'` (never plain `zod` — 5x bigger in the bundle) | `zod/mini` |
| Runtime validation on the server or in config | `import { z } from 'zod'` | `zod` |
| Icons | `lucide-react`, or a local SVG with `?react` | — |
| Translated copy | `const { t } = useTranslation()` | `react-i18next` |

## Placement

A component lives with its only consumer and moves only when a second one appears:

- used by one domain → `src/modules/<domain>/components/{atoms,molecules,organisms}/`
- used only by the layout chrome → `src/layouts/components/{atoms,molecules}/`
- used across domains → `src/components/{atoms,molecules,organisms}/`

Atom = no dependency on other components. Molecule = composes atoms. Organism = a self-contained section of a
page. When unsure between two levels, pick the lower one; promoting later is a move, demoting is a rewrite.

A domain owns its `types.ts` and its slice of `State`. Shared code (`src/store`, `src/lib`, `src/types`) must
never import from `src/modules`.

## Workflow

1. **Locate the nearest sibling.** Read an existing file of the same kind and mirror it — that is the style
   guide with the highest fidelity.
2. **Decide placement** with the rules above; say where the file goes and why before writing it.
3. **Write the failing test first** (`.claude/skills/tdd/SKILL.md`).
4. **Generate the file(s)** from the matching reference. A component means two files: `X.tsx` and,
   when it has any styling, `X.module.scss`.
5. **Wire it up** — a page needs an entry in `src/app/routes.ts`, an endpoint needs an entry in
   `src/lib/api/methods.ts`, a server route needs exporting from `server/routes.mjs`.
6. **Verify**: `bun run test`, `bun run typecheck`, `bun run lint`, `bun run stylelint`, `bun run deadcode`.
   Knip fails on anything generated but unreferenced, so never scaffold files "for later".
