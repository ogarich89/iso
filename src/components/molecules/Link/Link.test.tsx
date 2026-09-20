import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import routes from 'src/app/routes';
import { Link } from 'src/components/molecules/Link/Link';

const pageRoute = (path: string) => {
  const page = routes[0].children?.find((child) => child.path === path);
  if (!page) {
    throw new Error(`unknown route ${path}`);
  }
  return page;
};

describe('<Link />', () => {
  it('should render a navigation link', () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <Link to="/products" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
          products
        </Link>
      </MemoryRouter>,
    );

    const link = screen.getByText('products');

    expect(link.getAttribute('href')).toBe('/products');
    expect(link.className).toBe('active');
  });

  it('should preload the matching page on hover', () => {
    const preload = vi.spyOn(pageRoute('/products/:id').component, 'preload');

    render(
      <MemoryRouter>
        <Link to="/products/1">product</Link>
      </MemoryRouter>,
    );
    fireEvent.mouseOver(screen.getByText('product'));

    expect(preload).toHaveBeenCalled();

    preload.mockRestore();
  });

  it('should not preload the catch-all page', () => {
    const preload = vi.spyOn(pageRoute('*').component, 'preload');

    render(
      <MemoryRouter>
        <Link to="/unknown">unknown</Link>
      </MemoryRouter>,
    );
    fireEvent.mouseOver(screen.getByText('unknown'));

    expect(preload).not.toHaveBeenCalled();

    preload.mockRestore();
  });
});
