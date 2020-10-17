import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import reducer from './store';

const configureStore = (preloadState?: {[key: string]: any}) => {
  const composeEnhancers = composeWithDevTools({ name: 'ISOjs' });
  return createStore(reducer, preloadState, composeEnhancers(applyMiddleware(thunk  as ThunkMiddleware<any, any>)));
}

export default configureStore;
