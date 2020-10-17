import type { ParameterizedContext, Next } from 'koa';

const errors = () => {
  return async (ctx: ParameterizedContext, next: Next): Promise<void> => {
    try {
      await next();
    } catch (e) {
      console.error(e);
    }
  };
};

export { errors };
