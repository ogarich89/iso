import browserSync from 'browser-sync';
import gulpNodemon from 'gulp-nodemon';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { config } from './config/config.cjs';
import webpackClientConfig from './config/webpack/client.config.mjs';
import webpackServerConfig from './config/webpack/server.config.mjs';

const clientCompiler = webpack(webpackClientConfig);
const serverCompiler = webpack(webpackServerConfig);

const { inspect = false, port = 5000, browserSyncPort = 3003 } = config;

export const nodemon = async () => {
  const stream = gulpNodemon({
    script: 'server/index.mjs',
    watch: ['server/**/*.*', 'dist/request-handler.cjs'],
    exec: inspect ? 'node --inspect' : 'node',
  });
  stream.on('crash', () => stream.emit('restart', 300));
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
      })
    );
  });
  return new Promise((resolve) => {
    serverCompiler.hooks.done.tap('server', () => resolve());
  });
};

export const client = () => {
  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: webpackClientConfig.output.publicPath,
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
    middleware: [devMiddleware, webpackHotMiddleware(clientCompiler)],
  });
  return new Promise((resolve) => devMiddleware.waitUntilValid(resolve));
};

export const development = async () => {
  await client();
  await server();
  await nodemon();
};
