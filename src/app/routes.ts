import { route } from 'src/lib/route';
import { productQuery, productsQuery } from 'src/modules/products/queries';

const routes = [
  route({
    path: '',
    layout: 'main',
    children: [
      { path: '/', page: 'home' },
      {
        path: '/products',
        page: 'products',
        prefetch: (queryClient, { req }) => queryClient.prefetchQuery(productsQuery(req)),
      },
      {
        path: '/products/:id',
        page: 'product',
        prefetch: (queryClient, { params, req }) => queryClient.prefetchQuery(productQuery(params.id ?? '', req)),
      },
      { path: '*', page: 'not-found' },
    ],
  }),
];

export default routes;
