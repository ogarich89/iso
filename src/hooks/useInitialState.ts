import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import type { UnknownAction } from '@reduxjs/toolkit';
import type { InitialAction, Store } from 'src/types';

export const useInitialState = <Data>(
  initialAction: InitialAction,
  selector: (store: Store) => Data,
  resetAction?: () => UnknownAction
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
