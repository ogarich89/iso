import koaLogger from 'koa-logger';

const logger = () => {
  return async (ctx, next) => {
    await koaLogger((str, args) => {
      const [format, method, url, status, time, length] = args;
      console.info(format, method, `${url} ${ctx.get('x-requested-with') ? '\x1b[36mAJAX' : ''}`, status || '', time || '', length || '');
    })(ctx, next);
  };
};

export { logger };
