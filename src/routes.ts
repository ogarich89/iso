import { route } from 'src/libs/route';
import { getProduct, getProducts } from 'src/recoil/actions/products';

const routes = [
  route({
    path: '/',
    layout: 'main',
    children: [
      { path: '/', page: 'home' },
      { path: '/products', page: 'products', initialAction: getProducts },
      { path: '/products/:id', page: 'product', initialAction: getProduct },
      { path: '*', page: '404' },
    ],
  }),
];

export default routes;
