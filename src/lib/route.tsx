import { Suspense } from 'react';
import { Route } from 'react-router';
import { Loading } from 'src/components/molecules/Loading/Loading';
import type { PreloadableComponent } from 'src/lib/lazyWithPreload';
import { lazyWithPreload } from 'src/lib/lazyWithPreload';
import type { ExpandRoute, InitialAction, PageRoute } from 'src/types';

const DELAY = 300;

const byName = (modules: Record<string, () => Promise<unknown>>, suffix: RegExp) =>
  Object.fromEntries(
    Object.entries(modules).map(([path, loader]) => [
      path.slice(path.lastIndexOf('/') + 1).replace(suffix, ''),
      { path, loader },
    ]),
  );

const pages = byName(import.meta.glob('/src/modules/**/*.page.tsx'), /\.page\.tsx$/);
const layouts = byName(import.meta.glob(['/src/layouts/*.tsx', '!/src/layouts/*.test.tsx']), /\.tsx$/);

const noop: InitialAction = () => {};

interface Page {
  path: string;
  page: string;
  initialAction?: InitialAction;
  children?: Page[];
  delay?: number;
}

export interface Layout {
  path: string;
  layout: string;
  initialAction?: InitialAction;
  children?: Page[];
  delay?: number;
}

const buildPage = ({ path, page, delay = DELAY, children, initialAction }: Page): PageRoute => {
  const { path: modulePath, loader } = pages[page];
  return {
    path,
    modulePath,
    delay,
    component: lazyWithPreload(loader),
    initialAction: initialAction || noop,
    ...(children ? { children: children.map(buildPage) } : {}),
  };
};

export function route({ path, layout, delay = DELAY, children, initialAction }: Layout): PageRoute {
  const { path: modulePath, loader } = layouts[layout];
  return {
    path,
    modulePath,
    delay,
    component: lazyWithPreload(loader),
    initialAction: initialAction || noop,
    ...(children ? { children: children.map(buildPage) } : {}),
  };
}

export const expandRoutes = (
  routes: PageRoute[],
  parentActions: InitialAction[] = [],
  parentModules: string[] = [],
  parentComponents: PreloadableComponent[] = [],
): ExpandRoute[] =>
  routes.flatMap((route) => {
    const initialActions = [...parentActions, route.initialAction];
    const modulePaths = [...parentModules, route.modulePath];
    const components = [...parentComponents, route.component];
    return [
      { path: route.path, initialActions, modulePaths, components },
      ...(route.children ? expandRoutes(route.children, initialActions, modulePaths, components) : []),
    ];
  });

export const renderRoutes = (routes: PageRoute[]) =>
  routes.map(({ path, component: Component, initialAction, delay, children }, index) => (
    <Route
      key={index}
      path={path}
      element={
        <Suspense fallback={<Loading timeout={delay ?? DELAY} />}>
          <Component initialAction={initialAction} />
        </Suspense>
      }
    >
      {children ? renderRoutes(children) : null}
    </Route>
  ));
