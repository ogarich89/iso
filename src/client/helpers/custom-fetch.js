import 'isomorphic-fetch';
import queryString from 'query-string';

function customFetch (url, params, options = {}) {
  const {
    method = 'GET',
    headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  } = options || {};
  const isGET = method === 'GET';
  const search = isGET ? queryString.stringify(params) : undefined;
  return fetch(search ? `${url}?${search}` : url, {
    method,
    body: !isGET ? JSON.stringify(params): undefined,
    credentials: 'include',
    headers
  });
}

function checkStatus (response) {
  if(String(response.status).search(/^4|5/g) !== -1) {
    return response.json().then(response => {
      if(response) {
        throw response;
      } else {
        throw { message: 'Unknown error', code: 500 };
      }
    });
  } else {
    return response.json();
  }
}

export { customFetch, checkStatus };
