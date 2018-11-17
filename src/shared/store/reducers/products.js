import { FETCH_PRODUCT_SUCCESS, FETCH_PRODUCTS_SUCCESS } from '../constants/products';

export default (state = {}, { payload, type }) => {
  switch (type) {
    case FETCH_PRODUCT_SUCCESS:
      return { ...state, product: payload.product };
    case FETCH_PRODUCTS_SUCCESS:
      return { ...state, products: payload.products || [] };
    default:
      return state;
  }
};
