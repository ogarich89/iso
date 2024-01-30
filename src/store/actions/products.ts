import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from 'src/libs/api/request';

export const fetchProduct = createAsyncThunk(
  'product',
  async (req: { url: string }) => {
    const { url = '' } = req || {};
    const [, , id] = url.split('/');
    const { data: product } = await request('product', { id });
    return product;
  },
);

export const fetchProducts = createAsyncThunk('products', async () => {
  const { data: products } = await request('products', {});
  return products;
});
