import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { lazyImageObserver } from './helpers/lazy-load-images';
import { withSSR } from 'react-i18next';
import i18n from 'shared/libs/i18n';
import Fetch from 'i18next-fetch-backend';

import configureStore from '../shared/configure-store';
import App from '../shared/App';
const ExtendedApp = withSSR()(App);

const store = configureStore(window.__initialData__);

lazyImageObserver();

loadableReady(() => {
  i18n(Fetch);
  hydrate(
    <Provider store={store}>
      <BrowserRouter>
        <ExtendedApp initialLanguage={window.initialLanguage} initialI18nStore={window.initialI18nStore} />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
});

