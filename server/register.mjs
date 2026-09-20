import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cookie from '@fastify/cookie';
import session from '@fastify/session';
import serve from '@fastify/static';
import { RedisStore } from 'connect-redis';
import Redis from 'ioredis';

import { config } from '../config/index.mjs';

const { withStatic = true, sessionRedisDb, withRedis } = config;

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const initRedisStore = () => {
  const redisClient = new Redis({
    db: sessionRedisDb || 1,
  });
  return new RedisStore({
    client: redisClient,
  });
};

const register = (app, { isProduction } = {}) => {
  app.register(cookie);

  app.register(session, {
    ...(withRedis ? { store: initRedisStore() } : {}),
    cookieName: 'session_id',
    cookie: { secure: false },
    secret: process.env.SESSION_SECRET,
  });

  if (withStatic) {
    app.register(serve, {
      root: resolve(root, 'public'),
      prefix: '/public',
    });

    if (isProduction) {
      app.register(serve, {
        root: resolve(root, 'dist/client/assets'),
        prefix: '/assets',
        decorateReply: false,
      });
    }
  }
};

export { register };
