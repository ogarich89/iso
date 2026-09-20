# Generating a page, a domain or a store action

## Contents
- Anatomy of a domain
- The page
- Domain types
- The store slice and its actions
- Wiring the route
- Nested pages
- Checklist

## Anatomy of a domain

```
src/modules/<domain>/
  <name>.page.tsx                    default export, discovered by file name
  types.ts                           the domain's own types
  store/<domain>.ts                  State augmentation + initial actions
  components/{atoms,molecules,organisms}/
```

`<domain>` and page files are lowercase, hyphenated when needed (`not-found.page.tsx`). The page file name is
the key used in `src/app/routes.ts` — renaming the file renames the route entry.

## The page

A page renders states, nothing else: the data, the failure, the wait. Its const is lowercase and it is the
default export.

```tsx
import { Loading } from 'src/components/molecules/Loading/Loading';
import { useInitialState } from 'src/hooks/useInitialState';
import { PageNotFound } from 'src/modules/not-found/components/molecules/PageNotFound/PageNotFound';
import { ExampleComponent } from 'src/modules/example/components/organisms/Example/Example';
import { resetExample } from 'src/modules/example/store/example';

import type { PageComponent } from 'src/types';

const example: PageComponent = ({ initialAction }) => {
  const example = useInitialState(initialAction, (state) => state.example, resetExample);

  return example === null ? (
    <PageNotFound />
  ) : example ? (
    <ExampleComponent {...{ example }} />
  ) : (
    <Loading timeout={500} />
  );
};

export default example;
```

The three states are a contract: `null` means the request failed → not found, `undefined` means it has not
arrived yet → loading, anything else renders. Pass `resetExample` as the third argument only for a detail page
whose data must not leak into the next id.

A page without data takes no props:

```tsx
import type { FunctionComponent } from 'react';
import { Welcome } from 'src/modules/home/components/organisms/Welcome/Welcome';

const home: FunctionComponent = () => <Welcome />;
export default home;
```

## Domain types

```ts
export interface Example {
  id: number;
  name: string;
}

export type Examples = Example[];
```

Types stay in the domain. Shared code never imports them; the domain passes them into generic helpers such as
`request<Example>(...)`.

## The store slice and its actions

One file per domain in `store/`. It augments the shared `State` and exports plain functions — no hooks, no
classes, no zustand slice factories.

```ts
import { request } from 'src/lib/api/request';
import type { Example, Examples } from 'src/modules/example/types';
import type { AppStore } from 'src/store';
import type { InitialActionRequest } from 'src/types';

declare module 'src/store' {
  interface State {
    examples?: Examples | null;
    example?: Example | null;
  }
}

export const fetchExamples = async (store: AppStore) => {
  const examples = await request<Examples>('examples', {})
    .then(({ data }) => data)
    .catch(() => null);
  store.setState({ examples });
};

export const fetchExample = async (store: AppStore, req?: InitialActionRequest) => {
  const [, , id] = (req?.url ?? '').split('/');
  const example = await request<Example>('example', { id })
    .then(({ data }) => data)
    .catch(() => null);
  store.setState({ example });
};

export const resetExample = (store: AppStore) => {
  store.setState({ example: undefined });
};
```

Invariants:
- every slice field is optional and nullable (`?: T | null`) — `undefined` is "not loaded", `null` is "failed";
- actions always resolve, never throw: `.catch(() => null)`;
- an action takes the store and writes to it; it returns nothing;
- the id for a detail page comes from `req.url`, because on the server there is no router yet.

## Wiring the route

`src/app/routes.ts` is the only place routes exist:

```ts
import { route } from 'src/lib/route';
import { fetchExample, fetchExamples } from 'src/modules/example/store/example';

const routes = [
  route({
    path: '',
    layout: 'main',
    children: [
      { path: '/', page: 'home' },
      { path: '/examples', page: 'examples', initialAction: fetchExamples },
      { path: '/examples/:id', page: 'example', initialAction: fetchExample },
      { path: '*', page: 'not-found' },
    ],
  }),
];

export default routes;
```

`layout` and `page` are file names, not paths — `import.meta.glob` resolves them. Keep `{ path: '*' }` last.
`delay` (default 300ms) tunes how long the route may load before the `Loading` fallback appears.

A new page is reachable by SSR only through this table: it is what `expandRoutes` walks to preload modules and
run initial actions. A route added anywhere else renders blank on the server.

## Nested pages

Give the parent page an `<Outlet />` and nest the children:

```ts
{
  path: '/examples',
  page: 'examples',
  children: [{ path: '/examples/:id', page: 'example', initialAction: fetchExample }],
}
```

Child initial actions run after the parent's; both are awaited before `renderToString`.

## Checklist

- [ ] Tests first for the page states and for each action (`.claude/skills/tdd/SKILL.md`)
- [ ] `<name>.page.tsx` with a lowercase const and a default export
- [ ] Slice fields optional and nullable, declared via `declare module 'src/store'`
- [ ] Actions swallow failures into `null` and return nothing
- [ ] Route added to `src/app/routes.ts`, catch-all still last
- [ ] `bun run deadcode` clean — nothing generated is left unreferenced
