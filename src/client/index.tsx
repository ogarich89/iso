import { hydrateRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { withSSR } from 'react-i18next';
import './i18next';

import { App } from 'shared/App';
import { initializeState } from '../shared/recoil/initialize';
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

