import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import config from '../../../config/config';
const { server: { host } } = config;

const i18n = (...plugins: any[]): typeof i18next => {
  plugins.forEach(plugin => i18next.use(plugin));
  i18next.use(initReactI18next);
  i18next
    .init({
      fallbackLng: 'en',
      preload: ['en', 'ru'],
      interpolation: {
        escapeValue: false
      },
      backend: {
        loadPath: `${host}/public/locales/{{lng}}/{{ns}}.json`
      },
      debug: false,
      react: {
        useSuspense: false,
        wait: true
      }
    });
  return i18next;
};

export default i18n;
