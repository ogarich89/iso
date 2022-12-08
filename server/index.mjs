import Koa from 'koa';
import Router from 'koa-router';

import fs from 'fs';
import http from 'http';
import http2 from 'http2';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import config from '../config/config.cjs';
import { requestHandler } from '../dist/request-handler.cjs';

import { middleware } from './middleware.mjs';
import { routes } from './routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const statsFile = resolve(__dirname, '../dist/loadable-stats.json');

const {
  server: { port, certificate },
} = config;

const app = new Koa();
app.keys = ['secret', 'key'];
const router = new Router();

middleware(app);

routes.forEach(({ path, method, controller }) => {
  router[method](path, controller);
});

router.get('(.*)', (ctx, next) => requestHandler(ctx, next, { statsFile }));

app.use(router.routes());

const server = certificate
  ? http2.createSecureServer(
      {
        key: fs.readFileSync(certificate.key),
        cert: fs.readFileSync(certificate.cert),
        allowHTTP1: true,
      },
      app.callback()
    )
  : http.createServer(app.callback());

server.listen(port, () => {
  console.info('Server listening on port %s', port);
});
