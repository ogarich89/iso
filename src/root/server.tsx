import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import options from 'i18n';
import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import { renderToString } from 'react-dom/server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { matchPath } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import serialize from 'serialize-javascript';
import { App } from 'src/App';
import { expandNestedRoutes } from 'src/helpers';
import routes from 'src/routes';
import { initializeState } from 'src/store/initialize';

import type { InitOptions } from 'i18next';
import type { Request, Reply, ExpandRoute } from 'src/types';

i18next.use(Backend);
i18next.use(initReactI18next);

interface RequestHandler {
  (
    request: Request,
    reply: Reply,
    options: { statsFile: string },
  ): Promise<string>;
}

export const requestHandler: RequestHandler = async (
  request,
  reply,
  { statsFile },
) => {
  const store = initializeState();
  const extractor = new ChunkExtractor({ statsFile, entrypoints: ['bundle'] });

  const [path] = request.url.split('?');

  const appRoutes = routes
    .reduce<ExpandRoute[]>((acc, route) => {
      return [
        ...acc,
        {
          path: route.path,
          initialActions: [route.initialAction],
        },
        ...expandNestedRoutes(route.children, [route.initialAction]),
      ];
    }, [])
    .filter(({ path }) => path !== '*');

  const route = appRoutes.find((route) => matchPath(route, path));

  await Promise.all(
    route
      ? route.initialActions.map((initialAction) =>
          store.dispatch(initialAction(request)),
        )
      : [],
  );

  const lng = request.session.get('lng') || 'en';
  await i18next.init({ ...options(true), lng } as InitOptions);

  const html = renderToString(
    <ChunkExtractorManager extractor={extractor}>
      <Provider store={store}>
        <StaticRouter location={request.url}>
          <I18nextProvider i18n={i18next}>
            <App />
          </I18nextProvider>
        </StaticRouter>
      </Provider>
    </ChunkExtractorManager>,
  );
  const scriptTags = extractor.getScriptTags();
  const styleTags = extractor.getStyleTags();

  return await reply.view('index', {
    html,
    envType: process.env.NODE_ENV || 'development',
    initialData: serialize(store.getState()),
    scriptTags,
    styleTags,
    version: !isDevelopment ? `?version=${timestamp}` : '',
    initialLanguage: serialize(i18next.language),
    initialI18nStore: serialize(i18next.store.data),
  });
};
