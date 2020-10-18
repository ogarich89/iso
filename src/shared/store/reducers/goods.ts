import { RECEIVE_PRODUCT, RECEIVE_PRODUCTS } from '../constants/goods';
import type { AnyAction } from 'redux';

export default (state = {}, { payload, type }: AnyAction) => {
  switch (type) {
    case RECEIVE_PRODUCT:
      return { ...state, product: payload.product };
    case RECEIVE_PRODUCTS:
      return { ...state, products: payload.products || [] };
    default:
      return state;
  }
};
