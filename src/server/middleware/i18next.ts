import { i18n } from 'i18next';
import type { ParameterizedContext, Next } from 'koa';
import type { Language } from 'types';

interface Options {
  lookupSession?: string;
  order?: string[];
  fallbackLng?: Language;
}

const i18nextMiddleware = (i18next: i18n, options: Options) => {
  return async (ctx: ParameterizedContext, next: Next): Promise<void> => {
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
    ctx.i18next = i18next;
    await next();
  };
};

export { i18nextMiddleware };
