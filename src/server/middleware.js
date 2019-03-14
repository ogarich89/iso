import path from 'path';
import config from '../../config/config';

import render from 'koa-ejs';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import mount from 'koa-mount';
import session from 'koa-generic-session';
import { errors } from './middleware/errors';
import api from './api';
import { lastModified } from './middleware/last-modified';
import { storage } from './libs/storage';
import { logger } from './libs/logger';
import redisStore from 'koa-redis';
import i18n from 'shared/libs/i18n';
import { i18nextMiddleware } from './middleware/i18next';
import Backend from 'i18next-node-remote-backend';

const { server: { sessionRedisDb = 3, withStatic = true } = {} } = config;

const middleware = app => {

  app.use(logger());
  render(app, {
    root   : path.join(__dirname, '../public'),
    layout : false,
    viewExt: 'ejs',
    cache  : false
  });

  app.use(errors());
  app.use(session({
    store: redisStore({
      db: sessionRedisDb
    })
  }));
  app.use(bodyParser({ jsonLimit: '4mb' }));
  if(withStatic) {
    app.use(mount('/public', serve(path.resolve(__dirname, '../public'))));
    app.use(mount('/', serve(path.resolve(__dirname))));
  }

  app.use(i18nextMiddleware(i18n(Backend), {
    lookupSession: 'lng',
    order: ['session']
  }));
  app.use(api());
  app.use(lastModified());
  app.use(storage());
};

export { middleware };


