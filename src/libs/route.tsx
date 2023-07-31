import loadable from '@loadable/component';
import { Loading } from 'src/components/molecules/Loading/Loading';

import type { InitialAction, State, PageRoute } from 'src/types';

const DELAY = 300;

export const noop: InitialAction<Array<State<any>>> = async () => [];

export interface Page {
  path: string;
  page: string;
  initialAction?: InitialAction<Array<State<any>>>;
  children?: Page[];
  delay?: number;
}

export interface Layout {
  path: string;
  layout: string;
  initialAction?: InitialAction<Array<State<any>>>;
  children?: Page[];
  delay?: number;
}

const getNestedRoutes = (children?: Page[]): PageRoute[] | object => {
  return children
    ? {
        children: children.map(
          ({ path, page, delay, children, initialAction }) => ({
            path,
            component: loadable(() => import(`src/components/pages/${page}`), {
              fallback: <Loading timeout={delay || DELAY} />,
            }),
            initialAction: initialAction || noop,
            ...getNestedRoutes(children),
          })
        ),
      }
    : {};
};

export function route({
  path,
  delay = DELAY,
  children,
  initialAction,
  layout,
}: Layout): PageRoute {
  return {
    path,
    component: loadable(() => import(`src/components/layouts/${layout}`), {
      fallback: <Loading timeout={delay} />,
    }),
    initialAction: initialAction || noop,
    ...getNestedRoutes(children),
  };
}
