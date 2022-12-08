import bodyParser from 'koa-bodyparser';
import render from 'koa-ejs';
import session from 'koa-generic-session';
import mount from 'koa-mount';
import serve from 'koa-static';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import config from '../config/config.cjs';

import { logger } from './libs/logger.mjs';
import redisClient from './libs/redis-client.mjs';
import { storage } from './libs/storage.mjs';
import { errors } from './middleware/errors.mjs';
import { i18nextMiddleware } from './middleware/i18next.mjs';

const { server: { withStatic = true } = {} } = config;

const __dirname = dirname(fileURLToPath(import.meta.url));

const middleware = (app) => {
  app.use(logger());
  render(app, {
    root: resolve(__dirname, '../public'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
  });

  app.use(errors());
  app.use(bodyParser({ jsonLimit: '4mb' }));
  app.use(
    session({
      store: redisClient,
    })
  );

  if (withStatic) {
    app.use(mount('/public', serve(resolve(__dirname, '../public'))));
    app.use(mount('/', serve(resolve(__dirname, '../dist'))));
  }

  app.use(storage());
  app.use(i18nextMiddleware());
};

export { middleware };
