import options from 'i18n';
import type { InitOptions, Resource } from 'i18next';
import i18next from 'i18next';
import Fetch from 'i18next-http-backend';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { BrowserRouter, matchPath } from 'react-router';
import { App } from 'src/app/App';
import routes from 'src/app/routes';
import { expandRoutes } from 'src/lib/route';
import { createAppStore, StoreContext } from 'src/store';

const store = createAppStore(window.__initialData__);

const bootstrap = async () => {
  i18next.use(Fetch).use(initReactI18next);
  await i18next.init({
    ...options(),
    lng: window.initialLanguage,
    resources: window.initialI18nStore as Resource,
  } as InitOptions);

  const [pathname] = window.location.pathname.split('?');
  const matched = expandRoutes(routes)
    .filter(({ path }) => path)
    .find(({ path }) => matchPath(path, pathname));
  if (matched) {
    await Promise.all(matched.components.map((component) => component.preload()));
  }

  hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <StoreContext.Provider value={store}>
      <BrowserRouter>
        <I18nextProvider i18n={i18next}>
          <App />
        </I18nextProvider>
      </BrowserRouter>
    </StoreContext.Provider>,
  );
};

bootstrap();
