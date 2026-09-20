import { request } from 'src/lib/api/request';
import { createQueryClient } from 'src/lib/query';
import { productQuery, productsQuery } from 'src/modules/products/queries';

vi.mock('src/lib/api/request', () => ({ request: vi.fn() }));

const product = { id: 1, color: '#98b2d1', pantone_value: '15-4020', year: 2000, name: 'cerulean' };

describe('productsQuery', () => {
  beforeEach(() => {
    vi.mocked(request).mockReset();
  });

  it('should cache the loaded products under a stable key', async () => {
    vi.mocked(request).mockResolvedValue([product]);
    const queryClient = createQueryClient();

    await queryClient.prefetchQuery(productsQuery());

    expect(queryClient.getQueryData(['products'])).toEqual([product]);
  });

  it('should cache null when the request fails', async () => {
    vi.mocked(request).mockRejectedValue(new Error('network'));
    const queryClient = createQueryClient();

    await queryClient.prefetchQuery(productsQuery());

    expect(queryClient.getQueryData(['products'])).toBe(null);
  });

  it('should pass the incoming request through for cookie forwarding', async () => {
    vi.mocked(request).mockResolvedValue([product]);
    const req = { url: '/products', headers: { cookie: 'session=1' } };
    const queryClient = createQueryClient();

    await queryClient.prefetchQuery(productsQuery(req));

    expect(request).toHaveBeenCalledWith('products', expect.anything(), {}, undefined, req);
  });
});

describe('productQuery', () => {
  beforeEach(() => {
    vi.mocked(request).mockReset();
  });

  it('should key the query by id', async () => {
    vi.mocked(request).mockResolvedValue(product);
    const queryClient = createQueryClient();

    await queryClient.prefetchQuery(productQuery('1'));

    expect(queryClient.getQueryData(['product', '1'])).toEqual(product);
    expect(request).toHaveBeenCalledWith('product', expect.anything(), { id: '1' }, undefined, undefined);
  });

  it('should cache null when the request fails', async () => {
    vi.mocked(request).mockRejectedValue(new Error('network'));
    const queryClient = createQueryClient();

    await queryClient.prefetchQuery(productQuery('9'));

    expect(queryClient.getQueryData(['product', '9'])).toBe(null);
  });
});
