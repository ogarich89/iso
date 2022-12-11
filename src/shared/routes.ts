import { page } from 'shared/libs/page';
import { getProduct, getProducts } from 'shared/recoil/actions/products';

import type { Product, Products } from 'types';

const routes = [
  page('/', 'home'),
  page<Products | null>('/products', 'products', getProducts),
  page<Product | null>('/products/:id', 'products.product', getProduct),
  page('*', 'page-not-found', undefined, false),
] as const;

export default routes;
