import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { withSSR } from 'react-i18next';
import './i18next';

import configureStore from '../shared/configure-store';
import { App } from 'shared/App';
const ExtendedApp = withSSR()(App);
const store = configureStore(window.__initialData__);

const NODE_ENV = process.env.NODE_ENV || 'development';
if(NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    exclude: [/^Connect/, /^Route/, /^withRouter/, /^Link/, /^NavLink/, /^InnerLoadable/, /^Provider/, /^Switch/, /^Router/]
  });
}

loadableReady(() => {
  hydrate(
    <Provider store={store}>
      <BrowserRouter>
        <ExtendedApp
          initialLanguage={window.initialLanguage}
          initialI18nStore={window.initialI18nStore}
        />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
});

