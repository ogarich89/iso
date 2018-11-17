import Loadable from 'iso-loadable';
import Loading from './components/Loading/Loading';
import { getProduct, getProducts } from './store/actions/products';

const routes = [
  {
    path: '/',
    exact: true,
    component: Loadable({
      loader : () => import(/* webpackChunkName: "home.page" */ './pages/home'),
      loading: Loading,
      delay: 500
    })
  },
  {
    path: '/menu/:products',
    exact: true,
    component: Loadable({
      loader : () => import(/* webpackChunkName: "products.page" */ './pages/menu.products'),
      loading: Loading,
      delay  : 500
    }),
    initialAction: (api, req = {}) => getProducts(api, req)
  },
  {
    path: '/menu/:products/:product',
    exact: true,
    component: Loadable({
      loader : () => import(/* webpackChunkName: "product.page" */ './pages/menu.products.product'),
      loading: Loading,
      delay: 500
    }),
    initialAction: (api, req = {}) => getProduct(api, req)
  },
  {
    path: '*',
    component: Loadable({
      loader : () => import(/* webpackChunkName: "page-not-found" */ './pages/page-not-found'),
      loading: Loading,
      delay: 500
    })
  }
];

export default routes;
