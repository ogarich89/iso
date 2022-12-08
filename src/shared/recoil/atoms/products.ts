import { atom } from 'recoil';

import type { Product, Products } from 'types';

export const productAtom = atom<Product>({
  key: 'productAtom',
  default: undefined,
});

export const productsAtom = atom<Products>({
  key: 'productsAtom',
  default: undefined,
});
