const { server: { host } } = require('./config/config.cjs');

module.exports = {
  fallbackLng: false,
  interpolation: {
    escapeValue: false
  },
  backend: {
    loadPath: `${host}/public/locales/{{lng}}/{{ns}}.json`
  },
  debug: false,
  react: {
    useSuspense: false
  }
}