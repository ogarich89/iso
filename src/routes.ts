import { page } from 'src/libs/page';
import { getProduct, getProducts } from 'src/recoil/actions/products';

const routes = [
  page('/', 'home'),
  page('/products', 'products', getProducts),
  page('/products/:id', 'products.product', getProduct),
  page('*', 'page-not-found', undefined, false),
];

export default routes;
