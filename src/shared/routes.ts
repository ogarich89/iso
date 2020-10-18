import { page } from 'shared/libs/page';
import { getProduct, getProducts } from './store/actions/goods';

const routes = [
  page('/', 'home'),
  page('/products', 'products', getProducts),
  page('/products/:product', 'products.product', getProduct),
  page('*', 'page-not-found', undefined, false)
];

export default routes;
