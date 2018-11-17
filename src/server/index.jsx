import serialize from 'serialize-javascript';
import 'source-map-support/register';
import config from '../../config/config';
import url from 'url';

import Koa from 'koa';
import Router from 'koa-router';
import { routes } from './routes';
import { middleware } from './middleware';

import React from 'react';
import { StaticRouter, matchPath } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import appRoutes from '../shared/routes';
import App from '../shared/App';

import { Provider } from 'react-redux';
import configureStore from '../shared/configure-store';

import Loadable from 'iso-loadable';
import { getBundles } from 'iso-loadable/webpack';
import stats from '../../dist/iso-loadable.json';

const { server: { port } } = config;
const app = new Koa();
app.keys = ['secret', 'key'];
const router = new Router();

middleware(app);

routes.forEach(({ path, method, controller }) => {
  router[method](path, controller);
});

router.get('*', async (ctx, next) => {
  const store = configureStore();

  const promises = appRoutes.reduce((acc, route) => {
    const { pathname } = url.parse(ctx.url);
    if (matchPath(pathname, route) && route.initialAction) {
      acc.push(Promise.resolve(store.dispatch(route.initialAction(ctx.api, ctx.request))));
    }
    return acc;
  }, []);

  const version = !isDevelopment ? `?version=${timestamp}` : '';
  await Promise.all(promises).catch(next);

  const context = {};
  const initialData = store.getState();
  const modules = [];

  const html = renderToString(
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      <Provider store={store}>
        <StaticRouter location={ctx.url} context={context}>
          <App/>
        </StaticRouter>
      </Provider>
    </Loadable.Capture>
  );

  const bundles = getBundles(stats, modules);
  const scripts = bundles.filter(bundle => bundle.file.endsWith('.js'));
  const styles = bundles.filter(bundle => bundle.file.endsWith('.css'));
  scripts.forEach(bundle => bundle.version = version);
  styles.forEach(bundle => bundle.version = version);

  if(context.status === 404) {
    ctx.status = 404;
  }
  await ctx.render('index', {
    html,
    envType: process.env.NODE_ENV || 'development',
    initialData: serialize(initialData),
    scripts,
    styles,
    version
  });
});

app.use(router.routes());

Loadable.preloadAll().then(() => {
  app.listen(port, error => {
    if (error) {
      console.error(error);
    } else {
      console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
    }
  });
});
