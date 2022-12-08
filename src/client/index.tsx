import { loadableReady } from '@loadable/component';
import { hydrateRoot } from 'react-dom/client';
import { withSSR } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import 'client/i18next';

import { App } from 'shared/App';
import { initializeState } from 'shared/recoil/initialize';

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
