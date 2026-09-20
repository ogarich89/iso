import fs from 'node:fs';
import * as Sentry from '@sentry/node';
import Fastify from 'fastify';

import { config } from '../config/index.mjs';

import { register } from './register.mjs';
import { createRenderer } from './renderer/index.mjs';
import { routes } from './routes.mjs';

const isProduction = process.env.NODE_ENV === 'production';
const { port, certificate, logger, sentryDSN } = config;

if (sentryDSN) {
  Sentry.init({
    dsn: sentryDSN,
    environment: process.env.NODE_ENV || 'development',
    release: '2.0.0',
  });
}

const app = Fastify({
  ...(logger
    ? {
        logger: {
          transport: {
            target: 'pino-pretty',
          },
        },
      }
    : {}),
  ...(certificate
    ? {
        http2: true,
        https: {
          key: fs.readFileSync(certificate.key),
          cert: fs.readFileSync(certificate.cert),
          allowHTTP1: true,
        },
      }
    : {}),
});

app.setErrorHandler(async (error, _request, reply) => {
  if (sentryDSN) {
    Sentry.captureException(error);
  }
  reply.status(500).send(error);
});

const renderPage = await createRenderer(app);

register(app, { isProduction });

routes.forEach(({ url, method, handler, schema }) => {
  app.route({ method, url, handler, schema });
});

app.get('*', async (request, reply) => {
  try {
    const html = await renderPage({
      url: request.url,
      cookie: request.headers.cookie,
      lng: request.session.get('lng') || 'en',
    });
    reply.header('Content-Type', 'text/html').send(html);
  } catch (error) {
    if (sentryDSN) {
      Sentry.captureException(error);
    }
    reply.status(500).send(error);
  }
});

await app.listen({ port });
