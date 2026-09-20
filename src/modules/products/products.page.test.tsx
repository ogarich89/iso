import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { request } from 'src/lib/api/request';
import { createQueryClient } from 'src/lib/query';
import ProductsPage from 'src/modules/products/products.page';

vi.mock('src/lib/api/request', () => ({ request: vi.fn() }));

const product = { id: 1, color: '#98b2d1', pantone_value: '15-4020', year: 2000, name: 'cerulean' };

const renderPage = () => {
  const queryClient = createQueryClient();
  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/products']}>
          <ProductsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    ),
  };
};

describe('products page', () => {
  beforeEach(() => {
    vi.mocked(request).mockReset();
  });

  it('should render the products already in the cache without fetching again', () => {
    vi.mocked(request).mockResolvedValue([product]);
    const queryClient = createQueryClient();
    queryClient.setQueryData(['products'], [product]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/products']}>
          <ProductsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText('cerulean')).toBeTruthy();
    expect(request).not.toHaveBeenCalled();
  });

  it('should fetch the products when the cache is empty', async () => {
    vi.mocked(request).mockResolvedValue([product]);

    renderPage();

    expect(await screen.findByText('cerulean')).toBeTruthy();
    expect(request).toHaveBeenCalled();
  });

  it('should render the not found page when loading failed', async () => {
    vi.mocked(request).mockRejectedValue(new Error('network'));

    renderPage();

    expect(await screen.findByText('PAGE NOT FOUND')).toBeTruthy();
  });

  it('should render nothing while the products are pending', () => {
    vi.mocked(request).mockReturnValue(new Promise(() => undefined));

    const { container } = renderPage();

    expect(container.innerHTML).toBe('');
  });
});
