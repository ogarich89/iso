import path, {dirname} from 'path';
import config from '../config/config.js';

import render from 'koa-ejs';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import mount from 'koa-mount';
import session from 'koa-generic-session';
import { errors } from './middleware/errors.mjs';
import { storage } from './libs/storage.mjs';
import { logger } from './libs/logger.mjs';
import redisClient from './libs/redis-client.mjs';
import { i18nextMiddleware } from './middleware/i18next.mjs';
import { fileURLToPath } from 'url';

const { server: { withStatic = true } = {} } = config;

const __dirname = dirname(fileURLToPath(import.meta.url));

const middleware = (app) => {
  app.use(logger());
  render(app, {
    root   : path.join(__dirname, '../public'),
    layout : false,
    viewExt: 'ejs',
    cache  : false
  });

  app.use(errors());
  app.use(bodyParser({ jsonLimit: '4mb' }));
  app.use(session({
    store: redisClient
  }));

  if(withStatic) {
    app.use(mount('/public', serve(path.resolve(__dirname, '../public'))));
    app.use(mount('/', serve(path.resolve(__dirname, '../dist'))));
  }

  app.use(storage());
  app.use(i18nextMiddleware());
};

export { middleware };


