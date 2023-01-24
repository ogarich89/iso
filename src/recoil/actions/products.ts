import { request } from 'src/libs/api/request';
import { productAtom, productsAtom } from 'src/recoil/atoms/products';

import type { InitialAction, Product, Products, State } from 'src/types';

export const getProduct: InitialAction<[State<Product>]> = async (req) => {
  const { url = '' } = req || {};
  const [, , id] = url.split('/');
  const { data } = await request('product', { id }, undefined, req).catch(
    (error) => {
      console.error(error);
      return { data: null };
    }
  );
  return [[productAtom, data]];
};

export const getProducts: InitialAction<[State<Products>]> = async (req) => {
  const { data } = await request('products', {}, undefined, req).catch(
    (error) => {
      console.error(error);
      return { data: null };
    }
  );
  return [[productsAtom, data]];
};
