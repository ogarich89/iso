import { request } from 'src/libs/api/request';
import {
  RECEIVE_PRODUCT,
  RECEIVE_PRODUCTS,
} from 'src/store/constants/products';

import type { UnknownAction } from '@reduxjs/toolkit';
import type { Dispatch } from 'react';
import type { InitialAction, Product, Products } from 'src/types';

export const receiveProduct = (product?: Product) => ({
  type: RECEIVE_PRODUCT,
  payload: product,
});
const receiveProducts = (products: Products) => ({
  type: RECEIVE_PRODUCTS,
  payload: products,
});

export const getProduct: InitialAction = (req) => {
  const { url = '' } = req || {};
  const [, , id] = url.split('/');
  return async (dispatch: Dispatch<UnknownAction>) => {
    try {
      const { data: product } = await request('product', { id });
      dispatch(receiveProduct(product));
    } catch (e) {
      console.error(e);
    }
  };
};

export const getProducts: InitialAction = () => {
  return async (dispatch: Dispatch<UnknownAction>) => {
    try {
      const { data: products } = await request('products', {});
      dispatch(receiveProducts(products));
    } catch (e) {
      console.error(e);
    }
  };
};
