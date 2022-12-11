import { language } from '../handlers/language.mjs';

export default [
  {
    method: 'POST',
    url: '/session/language',
    handler: language,
    schema: {
      body: {
        lng: { type: 'string' },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  },
];
