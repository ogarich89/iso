import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { FastifyRequest } from 'fastify';
import { methods } from 'src/lib/api/methods';
import * as z from 'zod/mini';

export const serverTarget = () => ({
  base: globalThis.__API__ ?? import.meta.env.VITE_API,
  apiKey: globalThis.__API_KEY__ ?? import.meta.env.VITE_API_KEY,
});

const browserTarget = () => ({ base: '', apiKey: '' });

const target = import.meta.env.SSR ? serverTarget : browserTarget;

export type Methods = keyof typeof methods;

const pathResolver = (url: string, data?: Record<string, string>) => {
  if (!data) {
    return url;
  }
  return Object.entries(data).reduce((accum, [key, value]) => accum.replace(`:${key}`, value), url);
};

const buildHeaders = (apiKey: string, cookie?: string) => {
  const headers = {
    ...(apiKey ? { 'x-api-key': apiKey } : {}),
    ...(cookie ? { cookie } : {}),
  };
  return Object.keys(headers).length ? { headers } : {};
};

export const request = async <Schema extends z.ZodMiniType, Data = unknown>(
  key: Methods,
  schema: Schema,
  data: Data,
  params?: Record<string, string>,
  req?: {
    url: FastifyRequest['url'];
    headers?: FastifyRequest['headers'];
  },
): Promise<z.infer<Schema>> => {
  const { url = '', method } = methods[key] as AxiosRequestConfig;
  const { base, apiKey } = target();
  const { data: response } = await axios<{ data: unknown }>(`${base}${pathResolver(url, params)}`, {
    method,
    ...(method === 'GET' ? { params: data } : { data }),
    ...buildHeaders(apiKey, req?.headers?.cookie),
  });

  const parsed = schema.safeParse(response?.data);

  if (!parsed.success) {
    console.error(`Invalid response for "${key}"\n${z.prettifyError(parsed.error)}`);
    throw new Error(`Invalid response for "${key}"`);
  }

  return parsed.data;
};
