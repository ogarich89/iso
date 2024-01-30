import { createSlice } from '@reduxjs/toolkit';
import { fetchProduct, fetchProducts } from 'src/store/actions/products';

import type { Product, Products } from 'src/types';

const initialState: {
  products?: Products;
  product?: Product;
} = {};

export const productsSlice = createSlice({
  name: 'productsSlice',
  initialState,
  reducers: {
    resetProduct(state) {
      state.product = undefined;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.product = action.payload;
      });
  },
});

export const productsReducer = productsSlice.reducer;
