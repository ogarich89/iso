import options from 'i18n';
import type { InitOptions } from 'i18next';
import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import { renderToString } from 'react-dom/server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { matchPath, StaticRouter } from 'react-router';
import serialize from 'serialize-javascript';
import { App } from 'src/app/App';
import routes from 'src/app/routes';
import { expandRoutes } from 'src/lib/route';
import { createAppStore, StoreContext } from 'src/store';

i18next.use(Backend).use(initReactI18next);

export interface RenderContext {
  manifest?: Record<string, string[]>;
  cookie?: string;
  lng?: string;
}

export interface RenderResult {
  appHtml: string;
  preloadLinks: string;
  state: string;
}

const renderPreloadLink = (file: string): string => {
  const href = file.startsWith('/') ? file : `/${file}`;
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${href}">`;
  }
  if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${href}">`;
  }
  return '';
};

const renderPreloadLinks = (modules: string[], manifest: Record<string, string[]>): string => {
  const seen = new Set<string>();
  let links = '';
  for (const id of modules) {
    const files = manifest[id] || manifest[id.replace(/^\//, '')] || [];
    for (const file of files) {
      if (seen.has(file)) {
        continue;
      }
      seen.add(file);
      links += renderPreloadLink(file);
    }
  }
  return links;
};

export async function render(url: string, { manifest, cookie, lng = 'en' }: RenderContext = {}): Promise<RenderResult> {
  const store = createAppStore();
  const [pathname] = url.split('?');

  const matched = expandRoutes(routes)
    .filter(({ path }) => path && path !== '*')
    .find(({ path }) => matchPath(path, pathname));

  if (matched) {
    await Promise.all(matched.components.map((component) => component.preload()));
    await Promise.all(
      matched.initialActions.map((action) => action(store, { url, headers: cookie ? { cookie } : undefined })),
    );
  }

  if (!i18next.isInitialized) {
    await i18next.init({ ...options(true), lng } as InitOptions);
  } else if (i18next.language !== lng) {
    await i18next.changeLanguage(lng);
  }

  const appHtml = renderToString(
    <StoreContext.Provider value={store}>
      <StaticRouter location={url}>
        <I18nextProvider i18n={i18next}>
          <App />
        </I18nextProvider>
      </StaticRouter>
    </StoreContext.Provider>,
  );

  const preloadLinks = matched && manifest ? renderPreloadLinks(matched.modulePaths, manifest) : '';

  const state = [
    `<script>window.__initialData__ = ${serialize(store.getState())}</script>`,
    `<script>window.initialI18nStore = ${serialize(i18next.store.data)};` +
      `window.initialLanguage = ${serialize(i18next.language)}</script>`,
  ].join('\n');

  return { appHtml, preloadLinks, state };
}
