const NODE_ENV = process.env.NODE_ENV || 'development';
try {
  const config = require(`./environment/${NODE_ENV}.json`);
  module.exports = { config };
} catch (_) {
  const message = `Configure file (/config/environment/${NODE_ENV}.json) not found. Read the instruction (README.md)`;
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
