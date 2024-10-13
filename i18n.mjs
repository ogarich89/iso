import { config } from 'config';

const { port } = config;

export const LANGUAGES = ['en', 'ru'];

export default (isServer = false) => ({
  fallbackLng: 'en',
  supportedLngs: LANGUAGES,
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
