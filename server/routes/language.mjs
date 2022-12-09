import { language } from '../controllers/language.mjs';

export default [
  {
    method: 'POST',
    path: '/session/language',
    controller: language,
  },
];
