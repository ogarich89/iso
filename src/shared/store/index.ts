import { combineReducers } from 'redux';
import products from './reducers/products';

export default combineReducers({
  products
});

export type Store = {
  products: {
    product?: object,
    products?: Array<{ id: number }>
  }
}
