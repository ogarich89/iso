import { queryOptions } from '@tanstack/react-query';
import { request } from 'src/lib/api/request';
import { productSchema, productsSchema } from 'src/modules/products/types';
import type { ServerRequest } from 'src/types';

export const productsQuery = (req?: ServerRequest) =>
  queryOptions({
    queryKey: ['products'],
    queryFn: () => request('products', productsSchema, {}, undefined, req).catch(() => null),
  });

export const productQuery = (id: string, req?: ServerRequest) =>
  queryOptions({
    queryKey: ['product', id],
    queryFn: () => request('product', productSchema, { id }, undefined, req).catch(() => null),
  });
