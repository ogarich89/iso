import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import options from 'i18n';
import type { InitOptions, Resource } from 'i18next';
import i18next from 'i18next';
import Fetch from 'i18next-http-backend';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { BrowserRouter, matchPath } from 'react-router';
import { App } from 'src/app/App';
import routes from 'src/app/routes';
import { initMonitoring } from 'src/lib/monitoring';
import { createQueryClient } from 'src/lib/query';
import { expandRoutes } from 'src/lib/route';

const queryClient = createQueryClient();

const bootstrap = async () => {
  await initMonitoring();

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
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={window.__QUERY_STATE__}>
        <BrowserRouter>
          <I18nextProvider i18n={i18next}>
            <App />
          </I18nextProvider>
        </BrowserRouter>
      </HydrationBoundary>
    </QueryClientProvider>,
  );
};

bootstrap();
