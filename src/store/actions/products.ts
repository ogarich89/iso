import { request } from 'src/libs/api/request';
import { productsSlice } from 'src/store/reducers/productsSlice';

import type { InitialAction } from 'src/types';

const { receiveProduct, receiveProducts } = productsSlice.actions;

export const fetchProduct: InitialAction = (req) => {
  const { url = '' } = req || {};
  const [, , id] = url.split('/');
  return async (dispatch) => {
    try {
      const { data: product } = await request('product', { id });
      dispatch(receiveProduct(product));
    } catch (e) {
      console.error(e);
    }
  };
};

export const fetchProducts: InitialAction = () => {
  return async (dispatch) => {
    try {
      const { data: products } = await request('products', {});
      dispatch(receiveProducts(products));
    } catch (e) {
      console.error(e);
    }
  };
};
