import { rspack } from '@rspack/core';
import browserSync from 'browser-sync';
import nodemon from 'nodemon';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { config } from './config/config.cjs';
import rspackClientConfig from './config/rspack/client.config.mjs';
import rspackServerConfig from './config/rspack/server.config.mjs';

const clientCompiler = rspack(rspackClientConfig);
const serverCompiler = rspack(rspackServerConfig);

const { inspect, port, browserSyncPort } = config;

const server = async () => {
  nodemon({
    script: 'server/index.mjs',
    watch: ['server/**/*.*', 'dist/request-handler.cjs'],
    exec: inspect ? 'node --inspect' : 'node',
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
    middleware: [webpackHotMiddleware(clientCompiler, { reload: true })],
  });
};

const watchServer = () => {
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

const watchClient = () => {
  clientCompiler.watch({}, (err, stats) => {
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
    clientCompiler.hooks.done.tap('client', () => resolve());
  });
};

const development = async () => {
  await watchClient();
  await watchServer();
  await server();
};

const [, , command] = process.argv;

if (command === '--dev') {
  await development();
}
if (command === '--watch:client') {
  await watchClient();
}
if (command === '--watch:server') {
  await watchServer();
}
if (command === '--server') {
  await server();
}

process.on('SIGINT', () => {
  process.exit(0);
});
