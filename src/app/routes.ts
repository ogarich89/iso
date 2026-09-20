import { route } from 'src/lib/route';
import { fetchProduct, fetchProducts } from 'src/modules/products/store/products';

const routes = [
  route({
    path: '',
    layout: 'main',
    children: [
      { path: '/', page: 'home' },
      { path: '/products', page: 'products', initialAction: fetchProducts },
      { path: '/products/:id', page: 'product', initialAction: fetchProduct },
      { path: '*', page: 'not-found' },
    ],
  }),
];

export default routes;
