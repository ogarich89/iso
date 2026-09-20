import fs from 'node:fs';
import * as Sentry from '@sentry/bun';
import Fastify from 'fastify';

import { config } from '../config/index.mjs';

import { errorReply } from './error.mjs';
import { register } from './register.mjs';
import { createRenderer } from './renderer/index.mjs';
import { routes } from './routes.mjs';

const isProduction = process.env.NODE_ENV === 'production';
const { port, certificate, logger, sentryDSN, trustProxy } = config;

if (sentryDSN) {
  Sentry.init({
    dsn: sentryDSN,
    environment: process.env.NODE_ENV || 'development',
    release: '2.0.0',
  });
}

const app = Fastify({
  trustProxy,
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
  const { status, body } = errorReply(error, isProduction);
  if (status === 500) {
    app.log.error(error);
    if (sentryDSN) {
      Sentry.captureException(error);
    }
  }
  reply.status(status).send(body);
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
      nonce: reply.cspNonce?.script,
    });
    reply.header('Content-Type', 'text/html').send(html);
  } catch (error) {
    const { status, body } = errorReply(error, isProduction);
    app.log.error(error);
    if (sentryDSN) {
      Sentry.captureException(error);
    }
    reply.status(status).send(body);
  }
});

await app.listen({ port });
