import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes } from 'react-router';
import { expandRoutes, renderRoutes, route } from 'src/lib/route';

const prefetch = vi.fn();

const buildRoutes = () => [
  route({
    path: '',
    layout: 'main',
    children: [
      { path: '/', page: 'home' },
      { path: '/products', page: 'products', prefetch, delay: 0 },
    ],
  }),
];

describe('route', () => {
  it('should resolve layouts and pages by name', () => {
    const [layout] = buildRoutes();

    expect(layout.modulePath).toBe('/src/layouts/main.tsx');
    expect(layout.delay).toBe(300);
    expect(layout.children?.map(({ modulePath }) => modulePath)).toEqual([
      '/src/modules/home/home.page.tsx',
      '/src/modules/products/products.page.tsx',
    ]);
  });

  it('should keep the given prefetch and delay', () => {
    const [layout] = buildRoutes();

    expect(layout.children?.[1].prefetch).toBe(prefetch);
    expect(layout.children?.[1].delay).toBe(0);
  });

  it('should leave prefetch unset when a route loads no data', () => {
    const [layout] = buildRoutes();

    expect(layout.prefetch).toBeUndefined();
    expect(layout.children?.[0].prefetch).toBeUndefined();
  });
});

describe('expandRoutes', () => {
  it('should flatten routes and collect what a page needs from its parents', () => {
    const expanded = expandRoutes(buildRoutes());

    expect(expanded.map(({ path }) => path)).toEqual(['', '/', '/products']);
    expect(expanded[2].modulePaths).toEqual(['/src/layouts/main.tsx', '/src/modules/products/products.page.tsx']);
    expect(expanded[2].prefetches).toEqual([prefetch]);
    expect(expanded[1].prefetches).toEqual([]);
    expect(expanded[2].components).toHaveLength(2);
  });
});

describe('renderRoutes', () => {
  it('should render the page matching the location inside its layout', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>{renderRoutes(buildRoutes())}</Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('hello')).toBeTruthy();
    expect(screen.getByText('about')).toBeTruthy();
  });
});
