import axios from 'axios';
import config from 'config';

import { methods } from 'shared/api/methods';

import type { AxiosRequestConfig } from 'axios';
const {
  server: { api },
} = config;

export type Methods = keyof typeof methods;

export const request = async <T>(key: Methods, data: T): Promise<any> => {
  const { url = '', method } = methods[key] as AxiosRequestConfig;
  const { data: response } = await axios(`${api}${url}`, {
    method,
    ...(method === 'GET' ? { params: data } : { data }),
  });
  return response;
};
