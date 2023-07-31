const isDevelopment = process.env.NODE_ENV !== 'production';
const environment = isDevelopment
  ? 'development'
  : process.env.ENVIRONMENT || 'production';

try {
  const config = require(`./environment/${environment}.json`);
  module.exports = { config };
} catch (_) {
  // eslint-disable-next-line max-len
  const message = `Configure file (/config/environment/${environment}.json) not found. Read the instruction (README.md)`;
  console.warn(`MODULE_NOT_FOUND: \x1b[41m ${message} \x1b[0m`);
  console.warn(`\x1b[43m Warning! the default configuration is used! \x1b[0m`);
  const config = {
    port: 3000,
    browserSyncPort: 3001,
    api: 'https://reqres.in',
    withStatic: true,
    inspect: true,
    logger: true,
  };
  module.exports = { config };
}
