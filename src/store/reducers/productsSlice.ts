import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, Products } from 'src/types';

const initialState: {
  products?: Products;
  product?: Product;
} = {};

export const productsSlice = createSlice({
  name: 'productsSlice',
  initialState,
  reducers: {
    receiveProduct(state, action: PayloadAction<Product>) {
      state.product = action.payload;
    },
    receiveProducts(state, action: PayloadAction<Products>) {
      state.products = action.payload;
    },
    resetProduct(state) {
      state.product = undefined;
    },
  },
});

export const productsReducer = productsSlice.reducer;
