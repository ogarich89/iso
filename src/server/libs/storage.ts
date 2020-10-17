import type { ParameterizedContext, Next } from 'koa';

interface Storage {
  get(name: string, _default?: any): any;
  set<T>(name: string, value: T): T;
}

const storage = () => {
  return async (ctx: ParameterizedContext, next: Next): Promise<void> => {
    if (ctx.get('x-requested-with')) {
      return next();
    }
    if (!ctx.storage) {
      ctx.storage = ((): Storage => {
        const _store: Record<string, any> = {};
        return {
          get: (name, _default) => _store[name] ? _store[name] : _default,
          set: (name, value) => _store[name] = value
        };
      })();
    }
    await next();
  };
};

export { storage };
