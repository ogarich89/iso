import { loadableReady } from '@loadable/component';
import options from 'i18n';
import i18next from 'i18next';
import Fetch from 'i18next-http-backend';
import { hydrateRoot } from 'react-dom/client';
import { withSSR, initReactI18next } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { App } from 'src/App';
import { initializeState } from 'src/recoil/initialize';

import type { InitOptions } from 'i18next';

i18next.use(Fetch);
i18next.use(initReactI18next);
i18next.init(options() as InitOptions);

const ExtendedApp = withSSR()(App);

loadableReady(() => {
  hydrateRoot(
    document.getElementById('root') as HTMLDivElement,
    <RecoilRoot initializeState={initializeState(window.__initialData__)}>
      <BrowserRouter>
        <ExtendedApp
          initialLanguage={window.initialLanguage}
          initialI18nStore={window.initialI18nStore}
        />
      </BrowserRouter>
    </RecoilRoot>
  );
});
