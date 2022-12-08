import axios from 'axios';

import { methods } from './methods';

const settings = {
  headers: { 'x-requested-with': 'XMLHttpRequest' },
};

export const session = {
  get: async (key: keyof typeof methods) => {
    const { url } = methods[key];
    const { data } = await axios.get(url, window ? settings : undefined);
    return data;
  },
  set: async (key: keyof typeof methods, body: Record<string, any>) => {
    const { url } = methods[key];
    const { data } = await axios.post(url, body, window ? settings : undefined);
    return data;
  },
};
