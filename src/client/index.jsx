import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { lazyImageObserver } from './helpers/lazy-load-images';
import { I18nextProvider } from 'react-i18next';
import i18n from 'shared/libs/i18n';
import Fetch from 'i18next-fetch-backend';

const NODE_ENV = process.env.NODE_ENV || 'development';
if(NODE_ENV === 'development') {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React, {
    exclude: [/^Connect/, 'Route', /^withRouter/, 'Link', 'NavLink', 'InnerLoadable', 'Provider', 'Switch', 'Router']
  });
}

import configureStore from '../shared/configure-store';
import App from '../shared/App';

const store = configureStore(window.__initialData__);

lazyImageObserver();

loadableReady(() => {
  hydrate(
    <Provider store={store}>
      <BrowserRouter>
        <I18nextProvider
          i18n={i18n(Fetch)}
          initialI18nStore={window.initialI18nStore}
          initialLanguage={window.initialLanguage}
        >
          <App/>
        </I18nextProvider>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
});

