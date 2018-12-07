import { FETCH_PRODUCT_SUCCESS, FETCH_PRODUCTS_SUCCESS } from '../constants/products';

const receivedProduct = product => ({ type: FETCH_PRODUCT_SUCCESS, payload: { product } });
const receivedProducts = products => ({ type: FETCH_PRODUCTS_SUCCESS, payload: { products } });

const getProduct = (api, req) => {
  const { originalUrl } = req;
  const [,,id] = originalUrl.split('/');
  return (() => async (dispatch) => {
    try {
      const product = await api.fetch('product', { id });
      dispatch(receivedProduct(product));
    } catch (e) {
      console.error(e);
    }
  })();
};

const getProducts = (api) => {
  return (() => async (dispatch) => {
    try {
      const products = await api.fetch('products');
      dispatch(receivedProducts(products));
    } catch (e) {
      console.error(e);
    }
  })();
};

export { receivedProduct, getProduct, getProducts };
