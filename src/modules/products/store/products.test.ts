import { request } from 'src/lib/api/request';
import { fetchProduct, fetchProducts, resetProduct } from 'src/modules/products/store/products';
import { productSchema, productsSchema } from 'src/modules/products/types';
import { createAppStore } from 'src/store';

vi.mock('src/lib/api/request', () => ({ request: vi.fn() }));

const product = { id: 1, color: '#98b2d1', pantone_value: '15-4020', year: 2000, name: 'cerulean' };

describe('fetchProducts', () => {
  beforeEach(() => {
    vi.mocked(request).mockReset();
  });

  it('should put the loaded products into the store', async () => {
    vi.mocked(request).mockResolvedValue([product]);
    const store = createAppStore();

    await fetchProducts(store);

    expect(request).toHaveBeenCalledWith('products', productsSchema, {});
    expect(store.getState().products).toEqual([product]);
  });

  it('should store null when the request fails', async () => {
    vi.mocked(request).mockRejectedValue(new Error('network'));
    const store = createAppStore();

    await fetchProducts(store);

    expect(store.getState().products).toBe(null);
  });
});

describe('fetchProduct', () => {
  beforeEach(() => {
    vi.mocked(request).mockReset();
  });

  it('should take the id from the request url', async () => {
    vi.mocked(request).mockResolvedValue(product);
    const store = createAppStore();

    await fetchProduct(store, { url: '/products/1' });

    expect(request).toHaveBeenCalledWith('product', productSchema, { id: '1' });
    expect(store.getState().product).toEqual(product);
  });

  it('should request an empty id without a request url', async () => {
    vi.mocked(request).mockResolvedValue(product);
    const store = createAppStore();

    await fetchProduct(store);

    expect(request).toHaveBeenCalledWith('product', productSchema, { id: undefined });
  });

  it('should store null when the request fails', async () => {
    vi.mocked(request).mockRejectedValue(new Error('network'));
    const store = createAppStore();

    await fetchProduct(store, { url: '/products/1' });

    expect(store.getState().product).toBe(null);
  });
});

describe('resetProduct', () => {
  it('should drop the loaded product', () => {
    const store = createAppStore({ product });

    resetProduct(store);

    expect(store.getState().product).toBeUndefined();
  });
});
