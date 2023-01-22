import axios from 'axios';
import { config } from 'config';

import { methods } from 'shared/api/methods';

import type { AxiosRequestConfig } from 'axios';
import type { FastifyRequest } from 'fastify';
import type { Schema } from 'types';

const { api } = config;

export type Methods = keyof typeof methods;

const pathResolver = (url: string, data?: Record<string, string>) => {
  if (!data) {
    return url;
  }
  return Object.entries(data).reduce(
    (accum, [key, value]) => accum.replace(`:${key}`, value),
    url
  );
};

export const request = async <M extends Methods, D>(
  key: M,
  data: D,
  params?: Record<string, string>,
  req?: {
    url: FastifyRequest['url'];
    headers?: FastifyRequest['headers'];
  }
) => {
  const { url = '', method } = methods[key] as AxiosRequestConfig;
  const { headers } = req || {};
  const { data: response } = await axios<{ data: Schema[M] }>(
    `${api}${pathResolver(url, params)}`,
    {
      method,
      ...(method === 'GET' ? { params: data } : { data }),
      ...(headers ? { headers: { cookie: headers.cookie } } : {}),
    }
  );
  return response;
};
