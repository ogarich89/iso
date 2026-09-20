---
name: tdd
description: Test-driven development loop for this repo — write the failing test first, watch it fail, then implement. Use when adding a feature, changing behaviour, fixing a bug, or touching src/, server/ or config/. Triggers - implement, add, change, fix, refactor with tests, "write tests first", /tdd.
---

# TDD in `iso`

Canon TDD: list the cases, turn **one** into a runnable test, watch it fail, make it pass, tidy. The order is
not decoration — a test that was never red proves nothing about the code you just wrote.

## The loop

1. **Test list.** Write down the behaviours the change must have, including the ways it must not break what
   already works. Describe behaviour only; no decisions about internals yet. Keep the list in the response,
   not in the repo.
2. **One test.** Turn exactly one item into a real test with setup, invocation and assertions. Never convert
   the whole list at once.
3. **Red.** Run that file and read the failure: `bunx vitest run <path/to/file.test.tsx>`.
   It must fail on the **assertion**, not on a typo, a missing import or a bad mock. A test that passes
   straight away is a broken test or a behaviour that already exists — find out which before moving on.
4. **Green.** Write the smallest implementation that makes it pass, with every earlier test still passing.
5. **Tidy.** Clean up names and duplication while green. Never refactor and make a test pass in the same step.
6. Repeat from 2 until the list is empty, then run the full gate (below).

## Hard rules

- No implementation before a failing test exists for it.
- Never weaken a test to make it pass. If the expectation was wrong, say so explicitly and fix the
  expectation as its own step.
- One behaviour per test; the name says the behaviour (`should forward the cookie header of the incoming request`).
- Test through the public surface: rendered output, the store's state, the arguments a mocked boundary
  received. Never assert on internals a user of the module cannot see.
- A bug fix starts with a test that reproduces the bug.

## Commands

- `bun run test` — full suite with coverage. **`bun test` runs Bun's own runner and will fail** — always `bun run test`.
- `bunx vitest run <file>` — one file, the loop's inner cycle.
- `bunx vitest run <file> -t "<test name>"` — one test.
- `bunx vitest run <file> --disable-console-intercept` — when you need `console.log` while debugging a red test.
- `bunx vitest run -u` — update snapshots, only after reviewing the diff.

Before calling the work done: `bun run test`, `bun run typecheck`, `bun run lint`, `bun run stylelint`,
`bun run deadcode` — the same list `pre-commit` runs.

## Where tests live

Next to the code, same name: `Card.tsx` → `Card.test.tsx`, `url.ts` → `url.test.ts`. Snapshots land in
`__snapshots__/` beside them. Test files are typechecked, linted and formatted like any other file, and the
no-comments rule applies to them too.

`config/vitest.setup.ts` runs before every file: it mocks `react-i18next` (so `t('hello')` renders the key
`hello` and `i18n.language` is `en`) and stubs `window.scrollTo`. Environment is jsdom; `describe`, `it`,
`expect` and `vi` are globals.

## Recipes

**A component** — render it in the context it needs, assert on roles and text:

```tsx
render(
  <MemoryRouter initialEntries={['/products']}>
    <Card {...product} />
  </MemoryRouter>,
);
expect(screen.getByRole('link').getAttribute('href')).toBe('/products/1');
```

Query by role or text, never by CSS-module class — those names are hashed per build. Snapshots are a
supplement to real assertions, never the only assertion in a test.

**A page** — pages read data through `useInitialState`, so give them a router and a store, and cover all
three states (data, `null` → not found, `undefined` → initial action runs):

```tsx
render(
  <MemoryRouter initialEntries={['/products']}>
    <StoreContext.Provider value={createAppStore({ products })}>
      <ProductsPage initialAction={initialAction} />
    </StoreContext.Provider>
  </MemoryRouter>,
);
```

**A domain action** — mock `src/lib/api/request`, assert what landed in the store, and cover the rejected
request (the actions swallow failures into `null`).

**Anything that talks to the network** — mock the boundary, never hit it: `vi.mock('axios', () => ({ default: vi.fn() }))`
for `src/lib/api/request`, `vi.mock('src/lib/session', ...)` for the language switch.

**SSR** — `src/app/server.test.tsx` calls `render(url, ...)` and asserts on the returned HTML. Mock
`i18next-http-backend` so no locale request escapes. Two traps this suite exists to catch:

- a `<template data-msg="Switched to client rendering...">` in `appHtml` means a lazy component was not
  resolved before `renderToString` — SSR silently degraded to a client render;
- state set by an `initialAction` is only visible to the render if the store was **created with** it, because
  zustand serves `getInitialState()` as the server snapshot.

**Hydration** — `src/app/client.test.tsx` feeds real `appHtml` from the server entry into `#root` before
importing the client entry. A hydration mismatch surfaces as an unhandled error and fails the run; keep it
that way rather than silencing it.

## Anti-patterns

- Writing the test and the implementation in one pass, then running the suite once at the end.
- Tests that restate the implementation line by line — they pass forever and catch nothing.
- Asserting on hashed class names, snapshot-only tests, tests with no assertion.
- Mocking the unit under test, or mocking so deeply the test only exercises the mocks.
- Leaving a `.only` behind.
