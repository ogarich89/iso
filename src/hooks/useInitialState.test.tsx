import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { useInitialState } from 'src/hooks/useInitialState';
import type { AppStore } from 'src/store';
import { createAppStore, StoreContext } from 'src/store';

const product = { id: 1, color: '#98b2d1', pantone_value: '15-4020', year: 2000, name: 'cerulean' };

const wrapper =
  (store: AppStore) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={['/products/1']}>
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    </MemoryRouter>
  );

describe('useInitialState', () => {
  it('should run the initial action when there is no data', () => {
    const store = createAppStore();
    const initialAction = vi.fn();

    renderHook(() => useInitialState(initialAction, (state) => state.product), { wrapper: wrapper(store) });

    expect(initialAction).toHaveBeenCalledWith(store, { url: '/products/1' });
  });

  it('should skip the initial action when data is already in the store', () => {
    const store = createAppStore({ product });
    const initialAction = vi.fn();

    const { result } = renderHook(() => useInitialState(initialAction, (state) => state.product), {
      wrapper: wrapper(store),
    });

    expect(initialAction).not.toHaveBeenCalled();
    expect(result.current).toEqual(product);
  });

  it('should run the reset action on unmount', () => {
    const store = createAppStore({ product });
    const resetAction = vi.fn();

    const { unmount } = renderHook(() => useInitialState(vi.fn(), (state) => state.product, resetAction), {
      wrapper: wrapper(store),
    });

    expect(resetAction).not.toHaveBeenCalled();

    unmount();

    expect(resetAction).toHaveBeenCalledWith(store);
  });
});
