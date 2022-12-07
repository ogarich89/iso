const { server: { host } } = require('./config/config.cjs');

module.exports = (isServer = false) => ({
  fallbackLng: false,
  interpolation: {
    escapeValue: false
  },
  backend: {
    loadPath: `${isServer ? host : ''}/public/locales/{{lng}}/{{ns}}.json`
  },
  debug: false,
  react: {
    useSuspense: false
  }
})
