import { language } from 'server/controllers/language';
import type { Routes } from 'server/routes';

export default [
  {
    method: 'post',
    path: '/session/language',
    controller: language
  }
] as Routes;