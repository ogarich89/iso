const NODE_ENV = process.env.NODE_ENV || 'development';
try {
  const config = require(`./environment/${NODE_ENV}.json`);
  module.exports = { config };
} catch (_) {
  const message = `Configure file (/config/environment/${NODE_ENV}.json) not found. Read the instruction (README.md)`;
  throw `MODULE_NOT_FOUND: \x1b[41m ${message} \x1b[0m`;
}
