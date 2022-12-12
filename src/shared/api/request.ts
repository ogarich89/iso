import axios from 'axios';
import { config } from 'config';

import { methods } from 'shared/api/methods';

import type { AxiosRequestConfig } from 'axios';
import type { Schema } from 'types';

const { api } = config;

export type Methods = keyof typeof methods;

export const request = async <M extends Methods, D>(key: M, data: D) => {
  const { url = '', method } = methods[key] as AxiosRequestConfig;
  const { data: response } = await axios<{ data: Schema[M] }>(`${api}${url}`, {
    method,
    ...(method === 'GET' ? { params: data } : { data }),
  });
  return response;
};
