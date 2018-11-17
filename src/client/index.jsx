import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Loadable from 'iso-loadable';

import configureStore from '../shared/configure-store';
import App from '../shared/App';

const store = configureStore(window.__initialData__);

window.main = () => {
  Loadable.preloadReady().then(() => {
    hydrate(
      <Provider store={store}>
        <BrowserRouter>
          <App { ...{ pathname: location.pathname }}/>
        </BrowserRouter>
      </Provider>,
      document.getElementById('root')
    );
  });
};

