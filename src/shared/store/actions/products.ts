import { FETCH_PRODUCT_SUCCESS, FETCH_PRODUCTS_SUCCESS } from '../constants/products';

const receivedProduct = (product: object | undefined) => ({ type: FETCH_PRODUCT_SUCCESS, payload: { product } });
const receivedProducts = (products: object) => ({ type: FETCH_PRODUCTS_SUCCESS, payload: { products } });

const getProduct = (api: { fetch: Function }, req: { originalUrl: string }) => {
  const { originalUrl } = req;
  const [,,id] = originalUrl.split('/');
  return (() => async (dispatch: Function) => {
    try {
      const product = await api.fetch('product', { id });
      dispatch(receivedProduct(product));
    } catch (e) {
      console.error(e);
    }
  })();
};

const getProducts = (api: { fetch: Function }) => {
  return (() => async (dispatch: Function) => {
    try {
      const products = await api.fetch('products');
      dispatch(receivedProducts(products));
    } catch (e) {
      console.error(e);
    }
  })();
};

export { receivedProduct, getProduct, getProducts };
