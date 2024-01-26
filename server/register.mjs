import cookie from '@fastify/cookie';
import session from '@fastify/session';
import serve from '@fastify/static';
import view from '@fastify/view';
import RedisStore from 'connect-redis';
import ejs from 'ejs';
import Redis from 'ioredis';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { config } from '../config/config.cjs';

const { withStatic = true, sessionRedisDb, withRedis } = config;

const __dirname = dirname(fileURLToPath(import.meta.url));

const initRedisStore = () => {
  const redisClient = new Redis({
    db: sessionRedisDb || 1,
  });
  return new RedisStore({
    client: redisClient,
  });
};

const register = (app) => {
  app.register(cookie);

  app.register(view, {
    engine: {
      ejs,
    },
    root: resolve(__dirname, './templates'),
  });

  app.register(session, {
    ...(withRedis ? { store: initRedisStore() } : {}),
    cookieName: 'session_id',
    cookie: { secure: false },
    secret: 'VY0{W6C3u@syL>H((&^RQU"Q-t%gYfVl]vhVIT;xql3JTS$-B`Ek1264S}sX_49',
  });

  if (withStatic) {
    app.register(serve, {
      root: resolve(__dirname, '../public'),
      prefix: '/public',
    });
    app.register(serve, {
      root: resolve(__dirname, '../dist'),
      prefix: '/dist',
      decorateReply: false,
    });
  }
};

export { register };
