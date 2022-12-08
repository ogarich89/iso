const ENV = process.env.NODE_ENV;
const dirname = ENV !== 'production' && ENV !== 'staging' ? 'development' : ENV;

class CustomError extends Error {
  constructor({ name = 'MODULE_NOT_FOUND', stack = '', message }) {
    super();
    super.name = `\x1b[0m${name}\x1b[0m`;
    super.stack = stack;
    super.message = `\x1b[41m ${message} \x1b[0m`;
  }
}

let server;
try {
  server = require(`./${dirname}/server.json`);
} catch (e) {
  throw new CustomError({
    // eslint-disable-next-line max-len
    message: `Configure file not found (/config/${dirname}/server.json). Read the instruction (/config/__example__/readme.txt)`,
  });
}
module.exports = { server };
