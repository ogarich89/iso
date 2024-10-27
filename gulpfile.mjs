import { rspack } from '@rspack/core';
import browserSync from 'browser-sync';
import gulpNodemon from 'gulp-nodemon';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { config } from './config/config.cjs';
import rspackClientConfig from './config/rspack/client.config.mjs';
import rspackServerConfig from './config/rspack/server.config.mjs';

const clientCompiler = rspack(rspackClientConfig);
const serverCompiler = rspack(rspackServerConfig);

const { inspect, port, browserSyncPort } = config;

export const nodemon = async () => {
  gulpNodemon({
    script: 'server/index.mjs',
    watch: ['server/**/*.*', 'dist/request-handler.cjs'],
    exec: inspect ? 'node --inspect' : 'node',
  });
};

export const server = () => {
  serverCompiler.watch({}, (err, stats) => {
    if (err) {
      console.error(err);
    }
    console.log(
      stats.toString({
        modules: false,
        colors: true,
      }),
    );
  });
  return new Promise((resolve) => {
    serverCompiler.hooks.done.tap('server', () => resolve());
  });
};

export const client = () => {
  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: rspackClientConfig.output.publicPath,
  });
  browserSync.init(null, {
    host: 'localhost',
    port: browserSyncPort,
    proxy: `http://localhost:${port}/`,
    online: true,
    open: false,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    },
    middleware: [
      devMiddleware,
      webpackHotMiddleware(clientCompiler, { reload: true }),
    ],
  });
  return new Promise((resolve) => devMiddleware.waitUntilValid(resolve));
};

export const development = async () => {
  await client();
  await server();
  await nodemon();
};
