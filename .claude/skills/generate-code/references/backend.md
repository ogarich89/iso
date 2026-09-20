# Generating API calls and server endpoints

## Contents
- Calling the backend API
- Adding a Fastify endpoint
- Session
- What belongs on the server
- Checklist

## Calling the backend API

Endpoints live in one registry, `src/lib/api/methods.ts`:

```ts
export const methods = {
  example: {
    url: '/api/example/',
    method: 'GET',
  },
  examples: {
    url: '/api/examples/',
    method: 'GET',
  },
} as const;
```

Call them through `request`, which is domain-agnostic — the caller supplies the schema, and the response is
validated against it before anything else sees it:

```ts
const examples = await request('examples', examplesSchema, { page: 2 });
```

```ts
request(key, schema, data, params?, req?)
```

- `key` — a name from the registry;
- `schema` — the domain's `zod/mini` schema for the payload inside the `{ data }` envelope; a response that
  does not match is logged with the failing path and rejected, so the domain action turns it into `null`;
- `data` — query params for `GET`, the body otherwise;
- `params` — values substituted into `:placeholders` in the registry URL;
- `req` — the incoming Fastify request, when the call must carry its `cookie` header.

The host comes from `VITE_API` and the `x-api-key` header from `VITE_API_KEY`; both are injected by Vite, so
never read `process.env` from `src/`. Do not call `axios` directly outside `src/lib/`.

## Adding a Fastify endpoint

The server is plain `.mjs` with relative imports — no `src/` alias, no TypeScript. Three files:

`server/handlers/example.mjs`

```js
export const example = async (request, reply) => {
  const {
    body: { value },
  } = request;
  request.session.set('example', value);
  reply.send({ message: 'Example is saved' });
};
```

`server/routes/example.mjs` — every route declares a schema; Fastify validates and serialises from it. The
server side uses full `zod` (size does not matter there) and converts to JSON Schema with `draft-7`, which is
the dialect Fastify's ajv understands:

```js
import { z } from 'zod';

import { example } from '../handlers/example.mjs';

const body = z.object({
  value: z.string(),
});

export default [
  {
    method: 'POST',
    url: '/session/example',
    handler: example,
    schema: {
      body: z.toJSONSchema(body, { target: 'draft-7' }),
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  },
];
```

`server/routes.mjs` — the aggregator, the only place the server learns about routes:

```js
import example from './routes/example.mjs';
import language from './routes/language.mjs';

const routes = [...language, ...example];

export { routes };
```

Anything not matched here falls through to the `*` SSR route, so pick URL prefixes that cannot collide with
page paths (`/session/...`, `/api/...`).

## Session

From the client, go through `src/lib/session` rather than `axios`:

```ts
import { session } from 'src/lib/session';

await session.set('language', { lng });
```

Its registry is `src/lib/session/methods.ts`, whose URLs must match the Fastify routes above. Both calls send
`x-requested-with: XMLHttpRequest`.

## What belongs on the server

`config/index.mjs` is the only reader of `process.env`, through a zod schema in `parseConfig`. Add a new
setting to that schema with a default, cover it in `config/index.test.mjs`, document it in `.env` and in the
README table, and keep secrets in `.env.local`. A bad value then fails at boot naming the variable. Bun loads both files automatically. If the
value must reach browser code, expose it as a `VITE_*` entry in `define` in `vite.config.ts`, mirror it in
`vitest.config.ts`, and declare it in `src/types/global.d.ts` — and remember anything defined that way is
public.

## Checklist

- [ ] Test first — mock `axios` for `request`, mock `src/lib/api/request` for queries and pages
- [ ] New API endpoint added to `src/lib/api/methods.ts`, called only through `request`
- [ ] New server route has a schema and is exported from `server/routes.mjs`
- [ ] URL prefix cannot collide with a page path
- [ ] New env var: `config/index.mjs` + `.env` + README, and `define` + `global.d.ts` if the client needs it
