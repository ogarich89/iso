import qs from 'qs';
import { Route } from 'react-router-dom';

import path from 'path';

import type { InitialAction, ExpandRoute, PageRoute } from 'src/types';

export const isExternal = (url: string): boolean => {
  return /^(http:\/\/|https:\/\/|\/\/)/.test(url);
};

export const setOverflow = (isModalDisplayed: boolean): void => {
  const [html] = document.getElementsByTagName('html');
  const [content] = document.getElementsByTagName('main');
  if (isModalDisplayed) {
    if (!html.className.includes('hidden')) {
      const { scrollY } = window;
      try {
        sessionStorage.setItem('scroll', `${scrollY}`);
      } catch (e) {
        console.error(e);
      }
      if (scrollY !== 0) {
        content.style.transform = `translateY(-${scrollY}px)`;
      }
      html.classList.add('hidden');
    }
  } else {
    if (html.className.includes('hidden')) {
      html.classList.remove('hidden');
      const scrollY = sessionStorage.getItem('scroll') || '0';
      content.removeAttribute('style');
      window.scrollTo(0, +scrollY);
    }
  }
};

interface Options {
  params: Record<string, unknown>;
  paths: string[];
  hostname: string;
}

export const pathResolver = (
  ...options: Array<string | Record<string, unknown>>
) => {
  const { hostname, paths, params } = options.reduce(
    (acc, option) => {
      if (typeof option !== 'string') {
        return {
          ...acc,
          params: {
            ...acc.params,
            ...option,
          },
        };
      }

      if (/^https?:\/\//.test(option)) {
        return { ...acc, hostname: option.replace(/\/$/, '') };
      }

      return { ...acc, paths: [...acc.paths, option] };
    },
    { params: {}, paths: ['/'], hostname: '' } as Options,
  );

  const { pathname, query } = Object.entries(params).reduce(
    (acc, [key, value]) =>
      acc.pathname.includes(`:${key}`) &&
      (typeof value === 'string' || typeof value === 'number')
        ? {
            ...acc,
            pathname: acc.pathname.replace(`:${key}`, String(value)),
          }
        : {
            ...acc,
            query: {
              ...acc.query,
              [key]: value,
            },
          },
    { pathname: path.join(...paths).replace(/\/$/, ''), query: {} },
  );

  const search = qs.stringify(query, {
    arrayFormat: 'brackets',
    addQueryPrefix: true,
  });

  return `${hostname}${pathname}${search}`;
};

export const expandNestedRoutes = (
  routes: PageRoute[] | undefined,
  initialActions: InitialAction[],
): ExpandRoute[] =>
  routes?.reduce<ExpandRoute[]>(
    (acc, route) => [
      ...acc,
      {
        path: route.path,
        initialActions: [...initialActions, route.initialAction],
      },
      ...expandNestedRoutes(route.children, [
        ...initialActions,
        route.initialAction,
      ]),
    ],
    [],
  ) || [];

export const renderNestedRoutes = (routes?: PageRoute[]) =>
  routes?.map(
    ({ path, component: Component, initialAction, children }, index) => {
      return (
        <Route
          key={index}
          path={path}
          element={<Component {...{ initialAction }} />}
        >
          {renderNestedRoutes(children)}
        </Route>
      );
    },
  );
