import gulp from 'gulp';
import browserSync from 'browser-sync';
import nodemon from 'gulp-nodemon';
import config from './config/config';
const { server: { port } } = config;

gulp.task('nodemon', ['browserSync'], () => {
  const stream = nodemon({
    script: 'dist/server.js',
    watch: 'dist/*.*'
  });
  stream
    .on('start', () => browserSync.reload())
    .on('crash', () => stream.emit('restart', 10));
});

gulp.task('browserSync', () => {
  browserSync.init(null, {
    host: 'localhost',
    port: 3003,
    ui: {
      port: 3033
    },
    proxy: `http://localhost:${port}/`,
    open: false,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }
  });
});
