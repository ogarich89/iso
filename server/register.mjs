import cookie from '@fastify/cookie';
import session from '@fastify/session';
import serve from '@fastify/static';
import view from '@fastify/view';
import connect from 'connect-redis';
import ejs from 'ejs';
import Redis from 'ioredis';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import config from '../config/config.cjs';

const { server: { withStatic = true, sessionRedisDb } = {} } = config;

const __dirname = dirname(fileURLToPath(import.meta.url));

const RedisStore = connect(session);
const redisClient = new Redis({
  db: sessionRedisDb,
});

const register = (app) => {
  app.register(cookie);

  app.register(view, {
    engine: {
      ejs,
    },
    root: resolve(__dirname, '../public'),
  });

  app.register(session, {
    store: new RedisStore({
      client: redisClient,
    }),
    cookieName: 'session_id',
    cookie: { secure: false },
    secret: 'VY0{W6C3u@syL>H((&^RQU"Q-t%gYfVl]vhVIT;xql3JTS$-B`Ek1264S}sX_49',
  });

  if (withStatic) {
    app.register(serve, {
      root: resolve(__dirname, '../public'),
      prefix: '/public',
    });
    ['js', 'css', 'assets'].forEach((key) => {
      app.register(serve, {
        root: resolve(__dirname, `../dist/${key}`),
        prefix: `/${key}`,
        decorateReply: false,
      });
    });
  }
};

export { register };