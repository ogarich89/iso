import config from './config/config.cjs';

const {
  server: { host },
} = config;

export default (isServer = false) => ({
  fallbackLng: false,
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: `${isServer ? host : ''}/public/locales/{{lng}}/{{ns}}.json`,
  },
  debug: false,
  react: {
    useSuspense: false,
  },
});
