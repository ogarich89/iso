import { RECEIVE_PRODUCT, RECEIVE_PRODUCTS } from '../constants/products';
import { IProduct } from '../../../types';
import { Request } from 'koa';
import { Dispatch } from 'react';
import { request } from '../../api/request';
import { ThunkAction } from '../../libs/page';

const receiveProduct = (product?: IProduct) => ({ type: RECEIVE_PRODUCT, payload: { product } });
const receiveProducts = (products: IProduct[]) => ({ type: RECEIVE_PRODUCTS, payload: { products } });

const getProduct = (req?: Pick<Request, 'originalUrl'>): ThunkAction => {
  const { originalUrl = '' } = req || {};
  const [,,id] = originalUrl.split('/');
  return async (dispatch: Dispatch<any>) => {
    try {
      const { data: product } = await request('product', { id });
      dispatch(receiveProduct(product));
    } catch (e) {
      console.error(e);
    }
  }
};

const getProducts = (): ThunkAction => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const { data: products } = await request('products', {});
      console.log(products);
      dispatch(receiveProducts(products));
    } catch (e) {
      console.error(e);
    }
  };
};

export { receiveProduct, getProduct, getProducts };
