import { createContext, useContext } from 'react';

import type { StoreApi } from 'zustand';
import { createStore, useStore } from 'zustand';

export interface State {}

export type AppStore = StoreApi<State>;

export const createAppStore = (initialState: Partial<State> = {}): AppStore =>
  createStore<State>()(() => ({ ...initialState }));

export const StoreContext = createContext<AppStore | null>(null);

export const useStoreApi = (): AppStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStoreApi must be used within a StoreContext provider');
  }
  return store;
};

export function useAppStore<T>(selector: (state: State) => T): T {
  return useStore(useStoreApi(), selector);
}
