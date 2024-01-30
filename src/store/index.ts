import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { productsReducer } from 'src/store/reducers/productsSlice';

const reducer = combineReducers({
  productsReducer,
});

export type State = ReturnType<typeof reducer>;

export const initializeState = (preloadedState?: Partial<State>) =>
  configureStore({
    reducer,
    preloadedState,
    devTools: isDevelopment ? false : { name: 'ISOjs' },
  });

export type Store = ReturnType<typeof initializeState>;
export type Dispatch = Store['dispatch'];
