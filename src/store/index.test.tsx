import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import type { AppStore } from 'src/store';
import { createAppStore, StoreContext, useAppStore, useStoreApi } from 'src/store';

const product = { id: 1, color: '#98b2d1', pantone_value: '15-4020', year: 2000, name: 'cerulean' };

const wrapper =
  (store: AppStore) =>
  ({ children }: { children: ReactNode }) => <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;

describe('createAppStore', () => {
  it('should create an isolated store per call', () => {
    const store = createAppStore({ products: [product] });
    const another = createAppStore();

    expect(store.getState()).toEqual({ products: [product] });
    expect(another.getState()).toEqual({});
  });
});

describe('useStoreApi', () => {
  it('should throw outside of a provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useStoreApi())).toThrow('useStoreApi must be used within a StoreContext provider');

    consoleError.mockRestore();
  });

  it('should return the provided store', () => {
    const store = createAppStore();

    const { result } = renderHook(() => useStoreApi(), { wrapper: wrapper(store) });

    expect(result.current).toBe(store);
  });
});

describe('useAppStore', () => {
  it('should select state and react to updates', () => {
    const store = createAppStore();

    const { result } = renderHook(() => useAppStore((state) => state.products), { wrapper: wrapper(store) });

    expect(result.current).toBeUndefined();

    act(() => store.setState({ products: [product] }));

    expect(result.current).toEqual([product]);
  });
});
