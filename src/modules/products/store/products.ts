import { request } from 'src/lib/api/request';
import type { Product, Products } from 'src/modules/products/types';
import type { AppStore } from 'src/store';
import type { InitialActionRequest } from 'src/types';

declare module 'src/store' {
  interface State {
    products?: Products | null;
    product?: Product | null;
  }
}

export const fetchProducts = async (store: AppStore) => {
  const products = await request<Products>('products', {})
    .then(({ data }) => data)
    .catch(() => null);
  store.setState({ products });
};

export const fetchProduct = async (store: AppStore, req?: InitialActionRequest) => {
  const [, , id] = (req?.url ?? '').split('/');
  const product = await request<Product>('product', { id })
    .then(({ data }) => data)
    .catch(() => null);
  store.setState({ product });
};

export const resetProduct = (store: AppStore) => {
  store.setState({ product: undefined });
};
