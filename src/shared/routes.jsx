import Loading from './components/_common/Loading/Loading';
import { getProduct, getProducts } from './store/actions/products';
import loadable from '@loadable/component';
import React from 'react';
const delay = 300;
const routes = [
  {
    path: '/',
    exact: true,
    chunkName: 'home.page',
    component: loadable(() => import(/* webpackChunkName: "home.page" */ './pages/home'), {
      fallback: <Loading timer={delay}/>
    })
  },
  {
    path: '/products',
    exact: true,
    chunkName: 'products.page',
    component: loadable(() => import(/* webpackChunkName: "products.page" */ './pages/products'), {
      fallback: <Loading timer={delay}/>
    }),
    initialAction: (api, req = {}) => getProducts(api, req)
  },
  {
    path: '/products/:product',
    exact: true,
    chunkName: 'product.page',
    component: loadable(() => import(/* webpackChunkName: "product.page" */ './pages/products.product'), {
      fallback: <Loading timer={delay}/>
    }),
    initialAction: (api, req = {}) => getProduct(api, req)
  },
  {
    path: '*',
    chunkName: 'page-not-found',
    component: loadable(() => import(/* webpackChunkName: "page-not-found" */ './pages/page-not-found'), {
      fallback: <Loading timer={delay}/>
    })
  }
];

export default routes;
