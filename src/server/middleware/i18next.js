const i18nextMiddleware = (i18next, options) => {
  return async (ctx, next) => {
    const { lookupSession = 'lng', order = ['session'], fallbackLng = 'en' } = options || {};
    let lng = fallbackLng;
    order.forEach(item => {
      if(item === 'session') {
        lng = ctx.session[lookupSession];
        if(!lng) {
          ctx.session[lookupSession] = fallbackLng;
          lng = fallbackLng;
        }
      }
    });
    i18next.changeLanguage(lng);
    ctx.i18next = i18next;
    return next();
  };
};

export { i18nextMiddleware };
