import I18nextDetector from 'koa-i18next-detector';

const lngDetector = new I18nextDetector();
lngDetector.addDetector({
  name: 'mySessionDetector',

  lookup(ctx, options) {
    let found;
    if (options.lookupSession && ctx && ctx.sessions) {
      found = ctx.sessions[options.lookupMySession];
    }
    return found;
  },

  cacheUserLanguage(ctx, lng, options = {}) {
    if (options.lookupMySession && ctx && ctx.session) {
      ctx.session[options.lookupMySession] = lng;
    }
  }
});

export default lngDetector;
