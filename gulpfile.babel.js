import gulp from 'gulp';
import browserSync from 'browser-sync';
import nodemon from 'gulp-nodemon';

import config from './config/config';

const {
  server: {
    reloadDelay = 500,
    inspect = false,
    port = 5000,
    reload = true,
    browserSyncPort = 3003
  }
} = config;

async function serve () {
  let timer;
  const stream = nodemon({
    script: 'dist/server.js',
    watch: 'dist/*.*',
    exec: inspect ? 'node --inspect' : 'node'
  });
  stream
    .on('start', () => {
      if(!reload) return;
      if(timer) clearTimeout(timer);
      timer = setTimeout(() => {
        browserSync.reload();
      }, reloadDelay);
    })
    .on('crash', () => stream.emit('restart', 10));
}

async function synchronise () {
  browserSync.init(null, {
    host: 'localhost',
    port: browserSyncPort,
    proxy: `http://localhost:${port}/`,
    online: false,
    open: false,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }
  });
}

export default gulp.series(synchronise, serve);
