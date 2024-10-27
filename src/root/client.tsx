import { loadableReady } from '@loadable/component';
import options from 'i18n';
import i18next from 'i18next';
import Fetch from 'i18next-http-backend';
import { hydrateRoot } from 'react-dom/client';
import { withSSR, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { App } from 'src/App';
import { initializeState } from 'src/store';

import type { InitOptions } from 'i18next';

i18next.use(Fetch);
i18next.use(initReactI18next);

const ExtendedApp = withSSR()(App);
const store = initializeState(window.__initialData__);

loadableReady(async () => {
  await i18next.init(options() as InitOptions);
  hydrateRoot(
    document.getElementById('root') as HTMLDivElement,
    <Provider store={store}>
      <BrowserRouter>
        <ExtendedApp
          initialLanguage={window.initialLanguage}
          initialI18nStore={window.initialI18nStore}
        />
      </BrowserRouter>
    </Provider>,
  );
});
