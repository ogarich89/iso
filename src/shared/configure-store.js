import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import reducer from './store';

const configureStore = preloadedState =>
  createStore(reducer, preloadedState, composeWithDevTools(applyMiddleware(thunk)));

export default configureStore;