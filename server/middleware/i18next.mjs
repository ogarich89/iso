import options from '../../i18n.cjs';
import i18next from '../libs/i18next.mjs';

const i18nextMiddleware = () => {
  return async (request) => {
    if (request.headers['x-requested-with']) {
      return;
    }
  };
};

export { i18nextMiddleware };
