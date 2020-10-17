import koaLogger from 'koa-logger';
import type { ParameterizedContext, Next } from 'koa';

const logger = () => {
  return async (ctx: ParameterizedContext, next: Next): Promise<void> => {
    await koaLogger((str, args) => {
      const [format, method, url, status, time, length] = args as string[];
      console.info(format, method, `${url} ${ctx.get('x-requested-with') ? '\x1b[36mAJAX' : ''}`, status || '', time || '', length || '');
    })(ctx, next);
  };
};

export { logger };
