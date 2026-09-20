import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import proxy from '@fastify/http-proxy';
import session from '@fastify/session';
import serve from '@fastify/static';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

import { config } from '../config/index.mjs';

import { proxyHeaders } from './proxy.mjs';

const { withStatic, sessionRedisDb, redisUrl, withRedis, sessionSecret, api, apiKey } = config;

const PUBLIC_MAX_AGE = '1h';
const ASSETS_MAX_AGE = '1y';

const NO_CSP = { contentSecurityPolicy: false };

const cspOptions = {
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'style-src-attr': ["'unsafe-inline'"],
    'upgrade-insecure-requests': null,
  },
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const initRedisStore = async (app) => {
  const client = createClient({ url: redisUrl, database: sessionRedisDb || 1 });
  client.on('error', (error) => app.log.error(error));
  await client.connect();
  return new RedisStore({ client });
};

const register = async (app, { isProduction } = {}) => {
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET is required: set at least 32 characters in .env.local');
  }

  app.register(helmet, isProduction ? { enableCSPNonces: true, contentSecurityPolicy: cspOptions } : NO_CSP);

  app.register(cookie);

  app.register(session, {
    ...(withRedis ? { store: await initRedisStore(app) } : {}),
    cookieName: 'session_id',
    cookie: { secure: 'auto', httpOnly: true, sameSite: 'lax', path: '/' },
    secret: sessionSecret,
  });

  app.register(proxy, {
    upstream: api,
    prefix: '/api',
    rewritePrefix: '/api',
    undici: false,
    replyOptions: { rewriteRequestHeaders: proxyHeaders(apiKey) },
  });

  if (withStatic) {
    app.register(serve, {
      root: resolve(root, 'public'),
      prefix: '/public',
      maxAge: PUBLIC_MAX_AGE,
    });

    if (isProduction) {
      app.register(serve, {
        root: resolve(root, 'dist/client/assets'),
        prefix: '/assets',
        decorateReply: false,
        maxAge: ASSETS_MAX_AGE,
        immutable: true,
      });
    }
  }
};

export { register };
