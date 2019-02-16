import { products, product } from './routes/products';

const routes = [
  {
    method: 'get',
    path: '/api/products',
    controller: products
  },
  {
    method: 'get',
    path: '/api/product',
    controller: product
  }
];

export { routes };
