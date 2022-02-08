import i18next from '../libs/i18next.mjs';

const i18nextMiddleware = () => {
  return async (ctx, next) => {
    if (ctx.get('x-requested-with')) {
      return next();
    }
    const { lng = 'en' } = ctx.session || {};
    await i18next.changeLanguage(lng);
    ctx.storage.set('initialI18nStore', { [lng]: i18next.services.resourceStore.data[lng] })
    ctx.i18next = i18next;
    await next();
  };
};

export { i18nextMiddleware };
