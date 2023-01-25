import { config } from 'config';

const { port } = config;

export default (isServer = false) => ({
  fallbackLng: false,
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: `${
      isServer ? `http://localhost:${port}` : ''
    }/public/locales/{{lng}}/{{ns}}.json`,
  },
  debug: false,
  react: {
    useSuspense: false,
  },
});
