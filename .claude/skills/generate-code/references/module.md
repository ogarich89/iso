# Generating a page, a domain or a store action

## Contents
- Anatomy of a domain
- The page
- Domain types
- The queries
- Wiring the route
- Nested pages
- Checklist

## Anatomy of a domain

```
src/modules/<domain>/
  <name>.page.tsx                    default export, discovered by file name
  types.ts                           zod schemas and the types inferred from them
  queries.ts                         queryOptions factories for the domain
  components/{atoms,molecules,organisms}/
```

`<domain>` and page files are lowercase, hyphenated when needed (`not-found.page.tsx`). The page file name is
the key used in `src/app/routes.ts` — renaming the file renames the route entry.

## The page

A page renders states, nothing else: the data, the failure, the wait. Its const is lowercase and it is the
default export. It takes no props — the route supplies nothing, the query supplies everything.

```tsx
import { useQuery } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import { Loading } from 'src/components/molecules/Loading/Loading';
import { PageNotFound } from 'src/modules/not-found/components/molecules/PageNotFound/PageNotFound';
import { ExampleComponent } from 'src/modules/example/components/organisms/Example/Example';
import { exampleQuery } from 'src/modules/example/queries';

const example: FunctionComponent = () => {
  const { id } = useParams();
  const { data, isPending } = useQuery(exampleQuery(id ?? ''));

  return isPending ? <Loading timeout={500} /> : data ? <ExampleComponent example={data} /> : <PageNotFound />;
};

export default example;
```

Server-rendered pages are never pending: the route prefetched the query and the client hydrates that cache.
`isPending` is what a client-side navigation to a cold route shows.

A page without data is the same shape without the query:

```tsx
import type { FunctionComponent } from 'react';
import { Welcome } from 'src/modules/home/components/organisms/Welcome/Welcome';

const home: FunctionComponent = () => <Welcome />;
export default home;
```

## Domain types

Types are inferred from a schema, so the runtime check and the type cannot drift apart. Shared code that
reaches the browser uses **`zod/mini`**, not `zod` — the classic API costs about 23KB gzipped in the client
bundle, mini about 4.5KB.

```ts
import * as z from 'zod/mini';

export const exampleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const examplesSchema = z.array(exampleSchema);

export type Example = z.infer<typeof exampleSchema>;
export type Examples = z.infer<typeof examplesSchema>;
```

Declare only the fields the app uses: zod strips the rest, so an API that adds a field breaks nothing.
Types stay in the domain — shared code never imports them, the domain passes its schema into `request`.

## The queries

One `queries.ts` per domain. Each export is a `queryOptions` factory, so the key and the fetcher are written
once and used by both the route prefetch and the page.

```ts
import { queryOptions } from '@tanstack/react-query';
import { request } from 'src/lib/api/request';
import { exampleSchema, examplesSchema } from 'src/modules/example/types';
import type { ServerRequest } from 'src/types';

export const examplesQuery = (req?: ServerRequest) =>
  queryOptions({
    queryKey: ['examples'],
    queryFn: () => request('examples', examplesSchema, {}, undefined, req).catch(() => null),
  });

export const exampleQuery = (id: string, req?: ServerRequest) =>
  queryOptions({
    queryKey: ['example', id],
    queryFn: () => request('example', exampleSchema, { id }, undefined, req).catch(() => null),
  });
```

Invariants:
- the key names the resource and then everything that varies: `['example', id]`;
- the query function resolves to `null` on failure rather than throwing — an errored query is not dehydrated,
  so a throwing query function would make the server render a spinner instead of the not-found page;
- `req` is threaded through only so a server-side fetch can forward the incoming cookie;
- defaults (60s `staleTime`, no retry, no refetch on focus) belong in `src/lib/query.ts`, not in a query.

## Wiring the route

`src/app/routes.ts` is the only place routes exist:

```ts
import { route } from 'src/lib/route';
import { exampleQuery, examplesQuery } from 'src/modules/example/queries';

const routes = [
  route({
    path: '',
    layout: 'main',
    children: [
      { path: '/', page: 'home' },
      {
        path: '/examples',
        page: 'examples',
        prefetch: (queryClient, { req }) => queryClient.prefetchQuery(examplesQuery(req)),
      },
      {
        path: '/examples/:id',
        page: 'example',
        prefetch: (queryClient, { params, req }) => queryClient.prefetchQuery(exampleQuery(params.id ?? '', req)),
      },
      { path: '*', page: 'not-found' },
    ],
  }),
];

export default routes;
```

`params` comes from `matchPath` against the requested URL, so a detail route reads its id the same way on the
server and in the browser.

`layout` and `page` are file names, not paths — `import.meta.glob` resolves them. Keep `{ path: '*' }` last.
`delay` (default 300ms) tunes how long the route may load before the `Loading` fallback appears.

A new page is reachable by SSR only through this table: it is what `expandRoutes` walks to preload modules and
run prefetches. A route added anywhere else renders blank on the server.

## Nested pages

Give the parent page an `<Outlet />` and nest the children:

```ts
{
  path: '/examples',
  page: 'examples',
  children: [
    {
      path: '/examples/:id',
      page: 'example',
      prefetch: (queryClient, { params, req }) => queryClient.prefetchQuery(exampleQuery(params.id ?? '', req)),
    },
  ],
}
```

A child's prefetch is collected on top of its parent's; all of them are awaited before `renderToString`.

## Checklist

- [ ] Tests first for the page states and for each query (`.claude/skills/tdd/SKILL.md`)
- [ ] `<name>.page.tsx` with a lowercase const and a default export, no props
- [ ] `queryOptions` factory per resource, key written once
- [ ] Query functions resolve to `null` on failure
- [ ] Route added to `src/app/routes.ts`, catch-all still last
- [ ] `bun run deadcode` clean — nothing generated is left unreferenced
