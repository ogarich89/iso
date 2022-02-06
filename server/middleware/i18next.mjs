const i18nextMiddleware = (i18next, options) => {
  return async (ctx, next) => {
    if (ctx.get('x-requested-with')) {
      return next();
    }
    const { lookupSession = 'lng', order = ['session'], fallbackLng = 'ru' } = options || {};

    const lng = order.reduce((acc, value) => {
      if(value === 'session') {
        const _lng = ctx.session[lookupSession];
        if(!_lng) {
          return ctx.session[lookupSession] = fallbackLng;
        }
        return _lng;
      }
    }, fallbackLng);
    await i18next.changeLanguage(lng);
    ctx.storage.set("initialI18nStore", { [lng]: i18next.services.resourceStore.data[lng] })
    ctx.i18next = i18next;
    await next();
  };
};

export { i18nextMiddleware };
