# Iso ![GitHub package.json version](https://img.shields.io/github/package-json/v/ogarich89/iso?style=flat-square)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/ogarich89/iso/react?style=for-the-badge) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/ogarich89/iso/fastify?style=for-the-badge) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/ogarich89/iso/dev/typescript/master?style=for-the-badge)

Iso is a starter-pack for creating isomorphic single-page applications with SSR, running on Bun.

Powered by [ogarich89](https://github.com/ogarich89)

> #### Warning
> For comfortable development you will need knowledge of React, Zustand and Fastify.

### Tech

ISO uses a number of open source projects to work properly:

* [Bun](https://bun.sh/) - JavaScript runtime, package manager and script runner.
* [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types.
* [Fastify](https://www.fastify.io/) - Fast and low overhead web framework.
* [React](https://react.dev/) - Library for building user interfaces.
* [React Router](https://reactrouter.com/) - Routing for React.
* [Zustand](https://zustand.docs.pmnd.rs/) - Minimal state management.
* [Vite](https://vite.dev/) - Build tool and dev server with native SSR.
* [Vitest](https://vitest.dev/) - Unit test runner.
* [Testing Library](https://testing-library.com/) - Component testing utilities.
* [Biome](https://biomejs.dev/) - Linter and formatter.
* [react-i18next](https://react.i18next.com/) - Internationalization for React.

And of course ISO itself is open source with a [public repository](https://github.com/ogarich89/iso) on GitHub.

# Usage

### Install

ISO requires [Bun](https://bun.sh/) v1.4+ and (optionally) [Redis](https://redis.io). Node.js is not needed — Bun runs the server, the build and the tests.

```sh
$ git clone https://github.com/ogarich89/iso.git <project name>
$ cd <project name>
$ bun install
```

### Configuration

Configuration is read from environment variables. Defaults live in the committed `.env`; override them locally in `.env.local` (gitignored) or through real environment variables in deployment. Bun loads both files automatically.

| Variable | Description |
| --- | --- |
| `PORT` | Server port |
| `API` | Backend API hostname |
| `API_KEY` | Backend API key, sent as `x-api-key` (the demo backend [reqres.in](https://reqres.in) requires one). It is injected into the client bundle, so use it only for public/demo keys |
| `WITH_STATIC` | Serve `public/` and built assets with the app server |
| `WITH_REDIS` | Store sessions in Redis |
| `SESSION_REDIS_DB` | Redis database index for sessions |
| `LOGGER` | Fastify logger (pino-pretty) |
| `SENTRY_DSN` | Error monitoring with [Sentry](https://sentry.io) |
| `SESSION_SECRET` | Session cookie secret |
| `ENVIRONMENT` | Deployment environment marker (`production` \| `staging`) |
| `CERT_KEY` / `CERT_CERT` | Absolute paths for an HTTPS/HTTP2 certificate |

### Development

```sh
$ bun dev
```

New to the codebase? `.claude/skills/onboarding/SKILL.md` is a guided tour — how a request flows from Fastify
to hydration, where code belongs, and recipes for the usual first tasks. With Claude Code, run `/onboarding`.

The repo also ships `/tdd` (the test-first loop), `/generate-code` (writing new files in the project's
conventions, with its design tokens and mixins) and `/github` (commit convention, branches, pull requests).

Open http://localhost:3000

A single process runs the Fastify server, SSR and the Vite dev server (client bundling + HMR) together in middleware mode.

### Production

Build the client and SSR bundles:

```sh
$ bun run build
```

Run the server:

```sh
$ bun start
```

Or build and run in one step:

```sh
$ bun run serve
```

Open http://localhost:3000

### Quality

```sh
$ bun run test       # Vitest with coverage
$ bun run typecheck
$ bun run lint       # Biome
$ bun run stylelint
$ bun run deadcode   # Knip
```

`pre-commit` runs all of them. Note the `run`: `bun test` starts Bun's own test runner instead of Vitest.

### F.A.Q.

#### How to add a page?

1. Create a module with a page: `src/modules/example/example.page.tsx`
2. Connect the page in `src/app/routes.ts` (pages are referenced by file name)

```ts
const routes = [
  route({
    path: '',
    layout: 'main',
    children: [
      { path: '/example', page: 'example' },
    ],
  }),
];
```

#### How to add a nested page?

1. Add an [Outlet](https://reactrouter.com/api/components/Outlet) to the `example` page
2. Create file `nested.page.tsx` in `src/modules/example`
3. Connect the page in `src/app/routes.ts`

```ts
const routes = [
  route({
    path: '',
    layout: 'main',
    children: [
      {
        path: '/example',
        page: 'example',
        children: [{ path: '/example/nested', page: 'nested' }],
      },
    ],
  }),
];
```

#### How to add a test?

Tests live next to the code they cover (`Card.tsx` → `Card.test.tsx`) and run in jsdom. Write the failing test
first — `.claude/skills/tdd/SKILL.md` describes the loop and the recipes for components, pages, domain actions,
SSR and hydration.

```sh
$ bunx vitest run src/modules/products/components/molecules/Card/Card.test.tsx
```

#### How to create an initial action?

An initial action is a plain async function that receives the per-request store and the request, and writes data into the store. It runs on the server before render and on the client on navigation.

1. Create file `example.ts` in `src/modules/example/store`

```ts
import { request } from 'src/lib/api/request';

import type { AppStore } from 'src/store';
import type { InitialActionRequest } from 'src/types';

export const fetchExample = async (store: AppStore, req?: InitialActionRequest) => {
  const data = await request('example', {}, undefined, req)
    .then(({ data }) => data)
    .catch(() => null);
  store.setState({ example: data });
};
```

2. Add it to a route in `src/app/routes.ts`

```ts
{ path: '/example', page: 'example', initialAction: fetchExample }
```

3. Read it on the client with `useInitialState`

```tsx
const example = useInitialState(initialAction, (state) => state.example);
```
