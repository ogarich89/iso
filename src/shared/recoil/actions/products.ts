import { request } from 'shared/api/request';
import { productAtom, productsAtom } from 'shared/recoil/atoms/products';

import type { InitialAction, Product, Products } from 'types';

export const getProduct: InitialAction<Product | null> = async (req) => {
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

export const getProducts: InitialAction<Products | null> = async (req) => {
  const { data } = await request('products', {}, undefined, req).catch(
    (error) => {
      console.error(error);
      return { data: null };
    }
  );
  return [[productsAtom, data]];
};
