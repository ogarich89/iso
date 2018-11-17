import methods from './methods';
import { customFetch, checkStatus } from '../../client/helpers/custom-fetch';

export default (() => {
  const _methods = (() => {
    const _request = (url, params, options = {}) => customFetch(url, params, options).then(checkStatus);
    const obj = {};
    methods.forEach(({ name, url, options }) => {
      obj[name] = params => _request(url, params, options);
    });
    return obj;
  })();
  return {
    fetch(method, params) {
      if (_methods[method] && typeof _methods[method] === 'function') {
        return _methods[method](params);
      }
    }
  };
})();
