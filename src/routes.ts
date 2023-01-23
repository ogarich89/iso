import { page } from 'src/libs/page';
import { getProduct, getProducts } from 'src/recoil/actions/products';

import type { Product, Products } from 'src/types';

const routes = [
  page('/', 'home'),
  page<Products | null>('/products', 'products', getProducts),
  page<Product | null>('/products/:id', 'products.product', getProduct),
  page('*', 'page-not-found', undefined, false),
] as const;

export default routes;
