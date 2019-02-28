const isExternal = (url) => {
  return /^(http:\/\/|https:\/\/|\/\/)/.test(url);
};

class CustomError extends Error {
  constructor({ name = 'MODULE_NOT_FOUND', stack = '', message }) {
    super();
    super.name = `\x1b[0m${name}\x1b[0m`;
    super.stack = stack;
    super.message = `\x1b[41m ${message} \x1b[0m`;
  }
}

const patterns = {
  name: '^[\\S][A-Za-zА-Яа-яЁё\\-\\s]{1,}',
  address: '^[\\S][0-9A-Za-zА-Яа-яЁё№\\-\\s\\/\\.,]{2,}',
  apartment: '[0-9]{1,4}',
  entrance: '[0-9]{1,3}',
  floor: '[0-9]{1,3}'
};


export {
  isExternal,
  CustomError,
  patterns
};
