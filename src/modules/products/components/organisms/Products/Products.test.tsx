import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ProductsComponent } from 'src/modules/products/components/organisms/Products/Products';

const products = [
  { id: 1, color: '#98b2d1', pantone_value: '15-4020', year: 2000, name: 'cerulean' },
  { id: 2, color: '#c74375', pantone_value: '17-2031', year: 2001, name: 'fuchsia rose' },
];

describe('<ProductsComponent />', () => {
  it('should render a card per product', () => {
    render(
      <MemoryRouter>
        <ProductsComponent products={products} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('products');
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '/products/1',
      '/products/2',
    ]);
  });

  it('should render an empty list', () => {
    render(
      <MemoryRouter>
        <ProductsComponent products={[]} />
      </MemoryRouter>,
    );

    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
