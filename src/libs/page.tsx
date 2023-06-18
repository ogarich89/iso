import loadable from '@loadable/component';
import { Loading } from 'src/components/_common/Loading/Loading';
import { noopInitialAction } from 'src/helpers';

import type { InitialAction, State } from 'src/types';

const DELAY = 300;

export function page(
  path: string,
  name: string,
  initialAction?: InitialAction<Array<State<any>>>,
  children?: {
    name: string;
    path: string;
    initialAction?: InitialAction<Array<State<any>>>;
    delay?: number;
  }[],
  delay = DELAY
) {
  return {
    path,
    component: loadable(() => import(`../pages/${name}`), {
      fallback: <Loading timeout={delay} />,
    }),
    ...(children
      ? {
          children: children.map((child) => ({
            path: child.path,
            component: loadable(() => import(`../pages/${child.name}`), {
              fallback: <Loading timeout={child.delay || DELAY} />,
            }),
            initialAction: child.initialAction || noopInitialAction,
          })),
        }
      : {}),
    initialAction: initialAction || noopInitialAction,
  };
}
