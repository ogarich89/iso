import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { FastifyRequest } from 'fastify';
import { methods } from 'src/lib/api/methods';

const api = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

export type Methods = keyof typeof methods;

const pathResolver = (url: string, data?: Record<string, string>) => {
  if (!data) {
    return url;
  }
  return Object.entries(data).reduce((accum, [key, value]) => accum.replace(`:${key}`, value), url);
};

const buildHeaders = (cookie?: string) => {
  const headers = {
    ...(apiKey ? { 'x-api-key': apiKey } : {}),
    ...(cookie ? { cookie } : {}),
  };
  return Object.keys(headers).length ? { headers } : {};
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
  const { data: response } = await axios<{ data: T }>(`${api}${pathResolver(url, params)}`, {
    method,
    ...(method === 'GET' ? { params: data } : { data }),
    ...buildHeaders(req?.headers?.cookie),
  });
  return response;
};
