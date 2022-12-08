import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import appRoutes from '../shared/routes';
import { matchPath } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { renderToString } from 'react-dom/server';
import { RecoilRoot } from 'recoil';
import { I18nextProvider } from 'react-i18next';
import { App } from '../shared/App';
import serialize from 'serialize-javascript';
import type { ParameterizedContext, Next } from 'koa';
import { initializeState } from '../shared/recoil/initialize';

interface RequestHandler {
  (ctx: ParameterizedContext, next: Next, options: { statsFile: string }): Promise<void>;
}

export const requestHandler: RequestHandler = async (ctx, next, { statsFile }) => {
  const extractor = new ChunkExtractor({ statsFile, entrypoints: ['bundle'] });

  const route = appRoutes.find(route => matchPath(route, ctx.path))
  const state = route ? await route.initialAction(ctx.request) : [];

  const html = renderToString(
    <ChunkExtractorManager extractor={extractor}>
      <RecoilRoot initializeState={initializeState(state)}>
        <StaticRouter location={ctx.url}>
          <I18nextProvider i18n={ctx.i18next}>
            <App/>
          </I18nextProvider>
        </StaticRouter>
      </RecoilRoot>
    </ChunkExtractorManager>
  );
  const scriptTags = extractor.getScriptTags();
  const styleTags = extractor.getStyleTags();

  await ctx.render('index', {
    html,
    envType: process.env.NODE_ENV || 'development',
    initialData: serialize(state),
    scriptTags,
    styleTags,
    version: !isDevelopment ? `?version=${timestamp}` : '',
    initialLanguage: serialize(ctx.i18next.language),
    initialI18nStore: serialize(ctx.storage.get('initialI18nStore'))
  });
}
