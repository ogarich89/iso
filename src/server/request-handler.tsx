import configureStore from '../shared/configure-store';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import appRoutes from '../shared/routes';
import url from 'url';
import { matchPath, StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { App } from '../shared/App';
import serialize from 'serialize-javascript';
import type { ParameterizedContext, Next } from 'koa';

interface RequestHandler {
  (ctx: ParameterizedContext, next: Next, options: Record<string, any>): any
}

export const requestHandler: RequestHandler = async (ctx, next, { statsFile }) => {
  const store = configureStore();
  const extractor = new ChunkExtractor({ statsFile, entrypoints: ['bundle'] });
  const promises = appRoutes.reduce((acc: Promise<any>[], route) => {
    const { pathname = '' } = url.parse(ctx.url);
    if (matchPath(pathname as string, route)) {
      if(route.initialAction) {
        acc.push(Promise.resolve(store.dispatch(route.initialAction(ctx.request))));
      }
    }
    return acc;
  }, []);

  const version = !isDevelopment ? `?version=${timestamp}` : '';
  await Promise.all(promises).catch(next);

  const context: { statusCode?: number } = {};
  const initialData = store.getState();

  const html = renderToString(
    <ChunkExtractorManager extractor={extractor}>
      <Provider store={store}>
        <StaticRouter location={ctx.url} context={context}>
          <I18nextProvider i18n={ctx.i18next}>
            <App/>
          </I18nextProvider>
        </StaticRouter>
      </Provider>
    </ChunkExtractorManager>
  );
  const scriptTags = extractor.getScriptTags();
  const styleTags = extractor.getStyleTags();

  if(context.statusCode === 404) {
    ctx.status = 404;
  }

  const initialI18nStore: Record<string, any> = {};
  ctx.i18next.languages.forEach((l: string) => {
    initialI18nStore[l] = ctx.i18next.services.resourceStore.data[l];
  });
  await ctx.render('index', {
    html,
    envType: process.env.NODE_ENV || 'development',
    initialData: serialize(initialData),
    scriptTags,
    styleTags,
    version,
    initialLanguage: serialize(ctx.i18next.language),
    initialI18nStore: serialize(initialI18nStore)
  });
}
