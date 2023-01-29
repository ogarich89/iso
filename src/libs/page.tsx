import loadable from '@loadable/component';
import { Loading } from 'src/components/_common/Loading/Loading';

import type { InitialAction, State } from 'src/types';

const noop = async () => [];

export function page(
  path: string,
  name: string,
  initialAction?: InitialAction<Array<State<any>>>,
  delay = 300
) {
  return {
    path,
    component: loadable(() => import(`../pages/${name}`), {
      fallback: <Loading timeout={delay} />,
    }),
    initialAction: initialAction || noop,
  };
}
