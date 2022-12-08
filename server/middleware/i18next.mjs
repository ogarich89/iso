import options from '../../i18n.cjs';
import i18next from '../libs/i18next.mjs';

const i18nextMiddleware = () => {
  return async (ctx, next) => {
    if (ctx.get('x-requested-with')) {
      return next();
    }
    const { lng = 'en' } = ctx.session || {};
    await i18next.init({ ...options(true), lng });
    ctx.storage.set('initialI18nStore', { [lng]: i18next.store.data[lng] });
    ctx.i18next = i18next;
    await next();
  };
};

export { i18nextMiddleware };
