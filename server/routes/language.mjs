import { language } from '../controllers/language.mjs';

export default [
  {
    method: 'post',
    path: '/session/language',
    controller: language
  }
];
