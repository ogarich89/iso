import { configureStore as _configureStore } from '@reduxjs/toolkit';
import reducer from './store';

const configureStore = (preloadedState?: {[key: string]: any}) => {
  return _configureStore({
    reducer,
    preloadedState,
    devTools: isDevelopment ? false : { name: 'ISOjs' }
  })
}

export default configureStore;
