import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { request } from 'src/lib/api/request';
import { createQueryClient } from 'src/lib/query';
import ProductPage from 'src/modules/products/product.page';

vi.mock('src/lib/api/request', () => ({ request: vi.fn() }));

const product = { id: 2, color: '#c74375', pantone_value: '17-2031', year: 2001, name: 'fuchsia rose' };

const renderPage = (queryClient = createQueryClient()) =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/products/2']}>
        <Routes>
          <Route path="/products/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe('product page', () => {
  beforeEach(() => {
    vi.mocked(request).mockReset();
  });

  it('should render the product cached under the id in the url', () => {
    const queryClient = createQueryClient();
    queryClient.setQueryData(['product', '2'], product);

    renderPage(queryClient);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('fuchsia rose');
    expect(request).not.toHaveBeenCalled();
  });

  it('should fetch the product of the current id', async () => {
    vi.mocked(request).mockResolvedValue(product);

    renderPage();

    expect(await screen.findByRole('heading', { level: 1 })).toBeTruthy();
    expect(request).toHaveBeenCalledWith('product', expect.anything(), { id: '2' }, undefined, undefined);
  });

  it('should render the not found page when loading failed', async () => {
    vi.mocked(request).mockRejectedValue(new Error('network'));

    renderPage();

    expect(await screen.findByText('PAGE NOT FOUND')).toBeTruthy();
  });
});
