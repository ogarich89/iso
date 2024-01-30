import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/hooks/redux';

import type { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import type { State } from 'src/store';
import type { InitialAction } from 'src/types';

export const useInitialState = <Data>(
  initialAction: InitialAction,
  selector: (state: State) => Data,
  resetAction?: ActionCreatorWithoutPayload,
) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const data = useSelector(selector);

  useEffect(() => {
    if (!data) {
      dispatch(initialAction({ url: pathname }));
    }
    return () => {
      resetAction ? dispatch(resetAction()) : undefined;
    };
  }, [pathname]);

  return data;
};
