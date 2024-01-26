import Sentry from '@sentry/node';
import dotenv from 'dotenv';
import Fastify from 'fastify';

import fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { config } from '../config/config.cjs';
import { requestHandler } from '../dist/request-handler.cjs';

import { register } from './register.mjs';
import { routes } from './routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const statsFile = resolve(__dirname, '../dist/loadable-stats.json');

const { port, certificate, logger, sentryDSN } = config;

dotenv.config();

if (sentryDSN) {
  Sentry.init({
    dsn: sentryDSN,
    environment: process.env.NODE_ENV || 'development',
    release: '2.0.0',
  });
}

const app = new Fastify({
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

app.setErrorHandler(async (error, request, reply) => {
  if (sentryDSN) {
    Sentry.captureException(error);
  }

  reply.status(500).send({ error: 'Something went wrong' });
});

register(app);

routes.forEach(({ url, method, handler, schema }) => {
  app.route({ method, url, handler, schema });
});

app.get('*', {}, (request, reply) =>
  requestHandler(request, reply, { statsFile }),
);

app.listen({ port });
