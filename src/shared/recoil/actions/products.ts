import { request } from '../../api/request';
import { productAtom, productsAtom } from '../atoms/products';
import type { InitialAction, Product, Products } from '../../../types';

export const getProduct: InitialAction<Product> = async (req) => {
  const { originalUrl = '' } = req || {};
  const [,,id] = originalUrl.split('/');
  const { data } = await request('product', { id }).catch(error => {
    console.error(error);
    return { data: null }
  })
  return [
    [productAtom, data]
  ]
};

export const getProducts: InitialAction<Products> = async () => {
  const { data } = await request('products', {}).catch(error => {
    console.error(error);
    return { data: null }
  })
  return [
    [productsAtom, data]
  ]
};
