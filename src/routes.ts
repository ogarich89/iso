import { route } from 'src/libs/route';
import { fetchProduct, fetchProducts } from 'src/store/actions/products';

const routes = [
  route({
    path: '',
    layout: 'main',
    children: [
      { path: '/', page: 'home' },
      { path: '/products', page: 'products', initialAction: fetchProducts },
      { path: '/products/:id', page: 'product', initialAction: fetchProduct },
      { path: '*', page: '404' },
    ],
  }),
];

export default routes;
