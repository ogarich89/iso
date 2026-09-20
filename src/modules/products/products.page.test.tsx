import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ProductsPage from 'src/modules/products/products.page';
import type { Products } from 'src/modules/products/types';
import type { State } from 'src/store';
import { createAppStore, StoreContext } from 'src/store';

const list: Products = [{ id: 1, color: '#98b2d1', pantone_value: '15-4020', year: 2000, name: 'cerulean' }];

const renderPage = (state: Partial<State>, initialAction = vi.fn()) =>
  render(
    <MemoryRouter initialEntries={['/products']}>
      <StoreContext.Provider value={createAppStore(state)}>
        <ProductsPage initialAction={initialAction} />
      </StoreContext.Provider>
    </MemoryRouter>,
  );

describe('products page', () => {
  it('should render the loaded products', () => {
    renderPage({ products: list });

    expect(screen.getByText('cerulean')).toBeTruthy();
  });

  it('should render the not found page when loading failed', () => {
    renderPage({ products: null });

    expect(screen.getByText('PAGE NOT FOUND')).toBeTruthy();
  });

  it('should run the initial action while there is nothing to render', () => {
    const initialAction = vi.fn();

    const { container } = renderPage({}, initialAction);

    expect(container.innerHTML).toBe('');
    expect(initialAction).toHaveBeenCalled();
  });
});
