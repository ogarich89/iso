import config from '../config/config.js';
import path from 'path';
import http2 from 'http2';
import http from 'http';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import Koa from 'koa';
import Router from 'koa-router';
import { routes } from './routes.mjs';
import { middleware } from './middleware.mjs';
import { requestHandler } from '../dist/request-handler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const statsFile = path.resolve(__dirname, '../dist/loadable-stats.json');

const { server: { port, certificate } } = config;

const app = new Koa();
app.keys = ['secret', 'key'];
const router = new Router();

middleware(app);

routes.forEach(({ path, method, controller }) => {
  router[method](path, controller);
});

router.get('(.*)',  (ctx, next) => requestHandler(ctx, next, { statsFile }));

app.use(router.routes());

const server = certificate ? http2.createSecureServer({
  key: fs.readFileSync(certificate.key),
  cert: fs.readFileSync(certificate.cert),
  allowHTTP1: true
}, app.callback()) : http.createServer(app.callback());

server.listen(port, () => {
  console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
