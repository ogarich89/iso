import axios from 'axios';
import { methods } from './methods';
import config from '../../../config/config';
const { server: { host } } = config;

const settings = {
  headers: { 'x-requested-with': 'XMLHttpRequest' }
};

export const session = {
  get: async (key: keyof typeof methods) => {
    const { url } = methods[key];
    const { data } = await axios.get(`${host}${url}`, window ? settings : undefined);
    return data;
  },
  set: async (key: keyof typeof methods, body: Record<string, any>) => {
    const { url } = methods[key];
    const { data } = await axios.post(`${host}${url}`, body, window ? settings : undefined);
    return data;
  }
}
