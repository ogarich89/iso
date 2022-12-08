import { selector, selectorFamily } from 'recoil';
import { productsAtom, productAtom } from '../atoms/products';

export const productSelector = selectorFamily({
  key: 'productSelector',
  get: (id: string) => ({ get }) => get(productsAtom)?.find(product => +product.id === +id) || get(productAtom),
  set: () => ({ set, reset }, data) => data ? set(productAtom, data) : reset(productAtom)
});

export const productsSelector = selector({
  key: 'productsSelector',
  get: ({ get }) => get(productsAtom),
  set: ({ set }, data) => set(productsAtom, data)
});