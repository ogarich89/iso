import { atom } from 'recoil';

import type { Product, Products } from 'src/types';

export const productAtom = atom<Product | null>({
  key: 'productAtom',
  default: undefined,
});

export const productsAtom = atom<Products | null>({
  key: 'productsAtom',
  default: undefined,
});
