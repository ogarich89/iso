import { language } from '../handlers/language.mjs';

export default [
  {
    method: 'POST',
    url: '/session/language',
    handler: language,
    schema: {
      body: {
        type: 'object',
        properties: {
          lng: { type: 'string' },
        },
        required: ['lng'],
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
