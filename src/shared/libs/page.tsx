import loadable from '@loadable/component';

import { Loading } from 'shared/components/_common/Loading/Loading';

import type { LoadableComponent } from '@loadable/component';
import type { InitialAction } from 'types';

const noop = async () => [];

export function page<T>(
  path: string,
  name: string,
  initialAction?: InitialAction<T>,
  exact = true,
  delay = 300
): {
  path: string;
  exact: boolean;
  component: LoadableComponent<any>;
  initialAction: InitialAction<T>;
} {
  return {
    path,
    exact,
    component: loadable(() => import(`../pages/${name}`), {
      fallback: <Loading timeout={delay} />,
    }),
    initialAction: (initialAction || noop) as InitialAction<T>,
  };
}
