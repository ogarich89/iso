import { config } from 'config';

const { port } = config;

export default (isServer = false) => ({
  fallbackLng: false,
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: `${
      isServer ? `http://0.0.0.0:${port}` : ''
    }/public/locales/{{lng}}/{{ns}}.json`,
  },
  debug: false,
  react: {
    useSuspense: false,
  },
});
