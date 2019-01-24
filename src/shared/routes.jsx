import { getProduct, getProducts } from './store/actions/products';
import loadable from '@loadable/component';
import Loading from 'shared/components/_common/Loading/Loading';
import React from 'react';

const page = (path, name, func, exact = true, delay = 300) => {
  return {
    path,
    exact,
    chunkName: `pages-${name.replace('.', '-')}`,
    component: loadable(() => import(`./pages/${name}`), {
      fallback: <Loading timer={delay}/>
    }),
    initialAction: func ? (api, req = {}) => func(api, req) : null
  };
};

const routes = [
  page('/', 'home'),
  page('/products', 'products', getProducts),
  page('/products/:product', 'products.product', getProduct),
  page('*', 'page-not-found', null, false)
];

export default routes;
