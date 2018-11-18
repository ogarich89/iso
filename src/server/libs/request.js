import axios from 'axios';
import config from '../../../config/config';
const { server: { api } } = config;
import path from 'path';
import url from 'url';
const { protocol, hostname } = url.parse(api);

export default async (url, params, options = {}) => {
  const { headers = {}, method = 'GET' } = options || {};
  url = protocol + '//' + path.join(hostname, '/api/', url);
  const { data: { data } } = await axios.request({
    method,
    url,
    data: params,
    headers
  });

  return data;
};
