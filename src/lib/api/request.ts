import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { FastifyRequest } from 'fastify';
import { methods } from 'src/lib/api/methods';

const api = import.meta.env.VITE_API;

export type Methods = keyof typeof methods;

const pathResolver = (url: string, data?: Record<string, string>) => {
  if (!data) {
    return url;
  }
  return Object.entries(data).reduce((accum, [key, value]) => accum.replace(`:${key}`, value), url);
};

export const request = async <T, D = unknown>(
  key: Methods,
  data: D,
  params?: Record<string, string>,
  req?: {
    url: FastifyRequest['url'];
    headers?: FastifyRequest['headers'];
  },
): Promise<{ data: T }> => {
  const { url = '', method } = methods[key] as AxiosRequestConfig;
  const { headers } = req || {};
  const { data: response } = await axios<{ data: T }>(`${api}${pathResolver(url, params)}`, {
    method,
    ...(method === 'GET' ? { params: data } : { data }),
    ...(headers ? { headers: { cookie: headers.cookie } } : {}),
  });
  return response;
};
