import { getProduct, getProducts } from './store/actions/products';
import { page } from '../shared/helpers';

const routes = [
  page('/', 'home'),
  page('/products', 'products', getProducts),
  page('/products/:product', 'products.product', getProduct),
  page('*', 'page-not-found', null, false)
];

export default routes;
