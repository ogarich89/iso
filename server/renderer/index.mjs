import fs from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { collectSsrStyles, renderStyleTag } from './styles.mjs';
import { fillTemplate } from './template.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const isProduction = process.env.NODE_ENV === 'production';

const createProductionRenderer = async () => {
  const template = fs.readFileSync(resolve(root, 'dist/client/index.html'), 'utf-8');
  const manifest = JSON.parse(fs.readFileSync(resolve(root, 'dist/client/.vite/ssr-manifest.json'), 'utf-8'));
  const { render } = await import(resolve(root, 'dist/server/server.js'));

  return async ({ url, cookie, lng }) => {
    const { appHtml, preloadLinks, state } = await render(url, { manifest, cookie, lng });
    return fillTemplate(template, { head: preloadLinks, appHtml, state });
  };
};

const createDevelopmentRenderer = async (app) => {
  const { createServer } = await import('vite');
  const vite = await createServer({
    root,
    appType: 'custom',
    server: { middlewareMode: true },
  });
  const { default: middie } = await import('@fastify/middie');
  await app.register(middie);
  app.use(vite.middlewares);

  return async ({ url, cookie, lng }) => {
    try {
      const raw = fs.readFileSync(resolve(root, 'index.html'), 'utf-8');
      const template = await vite.transformIndexHtml(url, raw);
      const { render } = await vite.ssrLoadModule('/src/app/server.tsx');
      const { appHtml, state } = await render(url, { cookie, lng });
      const head = renderStyleTag(await collectSsrStyles(vite));
      return fillTemplate(template, { head, appHtml, state });
    } catch (error) {
      vite.ssrFixStacktrace(error);
      throw error;
    }
  };
};

export const createRenderer = (app) => (isProduction ? createProductionRenderer() : createDevelopmentRenderer(app));
