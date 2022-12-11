import Fastify from 'fastify';

import fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import config from '../config/config.cjs';
import { requestHandler } from '../dist/request-handler.cjs';

import { register } from './register.mjs';
import { routes } from './routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const statsFile = resolve(__dirname, '../dist/loadable-stats.json');

const {
  server: { port, certificate },
} = config;

const app = new Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
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

register(app);

routes.forEach(({ url, method, handler, schema }) => {
  app.route({
    method,
    url,
    handler,
    schema,
  });
});

app.get('*', {}, (request, reply) =>
  requestHandler(request, reply, { statsFile })
);

app.listen({ port });
