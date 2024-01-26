import {
  RECEIVE_PRODUCT,
  RECEIVE_PRODUCTS,
} from 'src/store/constants/products';

export const products = (state = {}, { payload, type }: any) => {
  switch (type) {
    case RECEIVE_PRODUCT:
      return { ...state, product: payload };
    case RECEIVE_PRODUCTS:
      return { ...state, products: payload || [] };
    default:
      return state;
  }
};
