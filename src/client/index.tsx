import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { withSSR } from 'react-i18next';
import './i18next';

import configureStore from '../shared/configure-store';
import { App } from 'shared/App';
const ExtendedApp = withSSR()(App);
const store = configureStore(window.__initialData__);

loadableReady(() => {
  hydrateRoot(
    document.getElementById('root') as HTMLDivElement,
    <Provider store={store}>
      <BrowserRouter>
        <ExtendedApp
          initialLanguage={window.initialLanguage}
          initialI18nStore={window.initialI18nStore}
        />
      </BrowserRouter>
    </Provider>
  );
});

