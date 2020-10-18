import type { LoadableComponent } from '@loadable/component';
import loadable from '@loadable/component';
import React from 'react';
import type { Dispatch } from 'redux';
import { Loading } from 'shared/components/_common/Loading/Loading';
import type { Request } from 'koa';

export interface ThunkAction {
  (dispatch: Dispatch): Promise<void>;
}

export interface InitialAction {
  (req?: Pick<Request, 'originalUrl'>): ThunkAction;
}

interface Page {
  (
    path: string | string[],
    name: string,
    initialAction?: InitialAction,
    exact?: boolean,
    delay?: number
  ): {
    path: string | string[];
    exact: boolean;
    component: LoadableComponent<any>;
    initialAction: InitialAction | null;
  };
}

export const page: Page = (path, name, initialAction, exact = true, delay = 300) => {
  return {
    path,
    exact,
    component: loadable(() => import(`../pages/${name}`), {
      fallback: <Loading timer={delay}/>
    }),
    initialAction: initialAction ? initialAction : null
  };
};
