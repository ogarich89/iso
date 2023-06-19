import loadable from '@loadable/component';
import { Loading } from 'src/components/_common/Loading/Loading';

import type { InitialAction, State, PageRoute } from 'src/types';

const DELAY = 300;

export const noop: InitialAction<Array<State<any>>> = async () => [];

export interface Page {
  path: string;
  name: string;
  initialAction?: InitialAction<Array<State<any>>>;
  children?: Page[];
  delay?: number;
}

const getNestedRoutes = (children?: Page[]): PageRoute[] | object => {
  return children
    ? {
        children: children.map(
          ({ path, name, delay, children, initialAction }) => ({
            path,
            component: loadable(() => import(`../pages/${name}`), {
              fallback: <Loading timeout={delay || DELAY} />,
            }),
            initialAction: initialAction || noop,
            ...getNestedRoutes(children),
          })
        ),
      }
    : {};
};

export function page({
  path,
  delay = DELAY,
  children,
  initialAction,
  name,
}: Page): PageRoute {
  return {
    path,
    component: loadable(() => import(`../pages/${name}`), {
      fallback: <Loading timeout={delay} />,
    }),
    initialAction: initialAction || noop,
    ...getNestedRoutes(children),
  };
}
