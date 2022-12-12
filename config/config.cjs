const NODE_ENV = process.env.NODE_ENV || 'development';

class CustomError extends Error {
  constructor({ name = 'MODULE_NOT_FOUND', stack = '', message }) {
    super();
    super.name = `\x1b[0m${name}\x1b[0m`;
    super.stack = stack;
    super.message = `\x1b[41m ${message} \x1b[0m`;
  }
}
try {
  const config = require(`./environment/${NODE_ENV}.json`);
  module.exports = { config };
} catch (_) {
  throw new CustomError({
    message: `Configure file (/config/environment/${NODE_ENV}.json) not found. Read the instruction (README.md)`,
  });
}
