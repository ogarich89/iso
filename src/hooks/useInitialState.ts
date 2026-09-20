import { useEffect } from 'react';
import { useLocation } from 'react-router';
import type { State } from 'src/store';
import { useAppStore, useStoreApi } from 'src/store';
import type { InitialAction, ResetAction } from 'src/types';

export const useInitialState = <Data>(
  initialAction: InitialAction,
  selector: (state: State) => Data,
  resetAction?: ResetAction,
) => {
  const { pathname } = useLocation();
  const store = useStoreApi();

  const data = useAppStore(selector);

  useEffect(() => {
    if (!data) {
      initialAction(store, { url: pathname });
    }
    return () => {
      resetAction?.(store);
    };
  }, [pathname]);

  return data;
};
