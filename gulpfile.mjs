import browserSync from 'browser-sync';
import gulpNodemon from 'gulp-nodemon';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackClientConfig from './config/webpack/client.config.mjs';
import webpackServerConfig from './config/webpack/server.config.mjs';

import config from './config/config.cjs';

const clientCompiler = webpack(webpackClientConfig);
const serverCompiler = webpack(webpackServerConfig);

const {
  server: {
    inspect = false,
    port = 5000,
    browserSyncPort = 3003
  }
} = config;

export const nodemon = () => {
  const stream = gulpNodemon({
    script: 'server/index.mjs',
    watch: ['server/*.*', 'dist/request-handler.cjs'],
    exec: inspect ? 'node --inspect' : 'node'
  });
  stream
    .on('crash', () => stream.emit('restart', 10));
}

export const server = () => {
  let initialized = false;
  return new Promise(resolve => {
    serverCompiler.watch({}, (err, stats) => {
      if(err) {
        console.error(err)
      }
      console.log(stats.toString({
        modules: false,
        colors: true
      }))
      if(!initialized) {
        initialized = true;
        resolve(initialized);
      }
    })
  })
}

export const client = () => {
  browserSync.init(null, {
    host: 'localhost',
    port: browserSyncPort,
    proxy: `http://localhost:${port}/`,
    online: false,
    open: false,
    logLevel: "silent",
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    },
    middleware: [
      webpackDevMiddleware(clientCompiler, {
        publicPath: "/",
      }),
      webpackHotMiddleware(clientCompiler),
    ]
  });
  let initialized = false;
  return new Promise(resolve => {
    clientCompiler.hooks.done.tap('done', () => {
      if(!initialized) {
        initialized = true;
        resolve(initialized)
      }
    })
  })
}

export const development = async () => {
  await client();
  await server();
  await nodemon();
}