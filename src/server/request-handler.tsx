import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import options from 'i18n';
import i18next from 'i18next';
import Backend from 'i18next-node-remote-backend';
import { renderToString } from 'react-dom/server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { matchPath } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { RecoilRoot } from 'recoil';
import serialize from 'serialize-javascript';

import { App } from 'shared/App';
import { initializeState } from 'shared/recoil/initialize';
import appRoutes from 'shared/routes';

import type { InitOptions } from 'i18next';
import type { Request, Reply } from 'types';

i18next.use(Backend);
i18next.use(initReactI18next);

interface RequestHandler {
  (
    request: Request,
    reply: Reply,
    options: { statsFile: string }
  ): Promise<string>;
}

export const requestHandler: RequestHandler = async (
  request,
  reply,
  { statsFile }
) => {
  const extractor = new ChunkExtractor({ statsFile, entrypoints: ['bundle'] });

  const route = appRoutes.find((route) => matchPath(route, request.routerPath));
  const state = route ? await route.initialAction(request) : [];

  const lng = request.session.get('lng') || 'en';
  await i18next.init({ ...options(true), lng } as InitOptions);

  const html = renderToString(
    <ChunkExtractorManager extractor={extractor}>
      <RecoilRoot initializeState={initializeState(state)}>
        <StaticRouter location={request.url}>
          <I18nextProvider i18n={i18next}>
            <App />
          </I18nextProvider>
        </StaticRouter>
      </RecoilRoot>
    </ChunkExtractorManager>
  );
  const scriptTags = extractor.getScriptTags();
  const styleTags = extractor.getStyleTags();

  return await reply.view('index', {
    html,
    envType: process.env.NODE_ENV || 'development',
    initialData: serialize(state),
    scriptTags,
    styleTags,
    version: !isDevelopment ? `?version=${timestamp}` : '',
    initialLanguage: serialize(i18next.language),
    initialI18nStore: serialize({ [lng]: i18next.store.data[lng] }),
  });
};
