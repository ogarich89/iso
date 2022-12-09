import cookie from '@fastify/cookie';
import { fastifyRequestContext } from '@fastify/request-context';
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

const middleware = (app) => {
  app.register(cookie);
  app.register(fastifyRequestContext);

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
    secret: 'VY0{W6C3u@syL>H((&^RQU"Q-t%gYfVl]vhVIT;xql3JTS$-B`Ek1264S}sX_49',
  });

  if (withStatic) {
    // app.register(serve, {
    //   root: resolve(__dirname, '../public'),
    //   prefix: '/public',
    // });
    // app.register(serve, {
    //   root: resolve(__dirname, '../dist'),
    //   prefix: '/',
    //   decorateReply: false,
    // });
  }
};

export { middleware };
