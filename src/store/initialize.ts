import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { products } from 'src/store/reducers/products';

import type { Store } from 'src/types';

const reducer = combineReducers({
  products,
});

export const initializeState = (preloadedState?: Partial<Store>) =>
  configureStore({
    reducer,
    preloadedState,
    devTools: isDevelopment ? false : { name: 'ISOjs' },
  });
