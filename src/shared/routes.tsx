import { getProduct, getProducts } from './store/actions/products';
import loadable from '@loadable/component';
import Loading from 'shared/components/_common/Loading/Loading';
import React from 'react';

type Page = {
  path: string,
  exact: boolean,
  component: any,
  initialAction: Function | null
}

const page = (path: string, name: string, func: Function | null = null, exact: boolean = true, delay: number = 300): Page => {
  return {
    path,
    exact,
    component: loadable(() => import(`./pages/${name}`), {
      fallback: <Loading timer={delay}/>
    }),
    initialAction: func ? (api: object, req: object = {}) => func(api, req) : null
  };
};

const routes = [
  page('/', 'home'),
  page('/products', 'products', getProducts),
  page('/products/:product', 'products.product', getProduct),
  page('*', 'page-not-found', null, false)
];

export default routes;
