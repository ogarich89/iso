import request from '../libs/request';
import { methods } from './methods';

export default () => {
  return (ctx, next) => {
    const _request = (path, params = {}) => {
      return request(path, params);
    };
    ctx.api = {
      fetch: (method, params) => {
        if (methods[method] && typeof methods[method] === 'function') {
          return methods[method](params, _request);
        }
      }
    };
    return next();
  };
};


