import { page } from 'src/libs/page';
import { getProduct, getProducts } from 'src/recoil/actions/products';

const routes = [
  page({ path: '/', name: 'home' }),
  page({ path: '/products', name: 'products', initialAction: getProducts }),
  page({ path: '/products/:id', name: 'product', initialAction: getProduct }),
  page({ path: '*', name: 'page-not-found' }),
];

export default routes;
