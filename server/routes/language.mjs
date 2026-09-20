import { z } from 'zod';

import { LANGUAGES } from '../../config/i18n.mjs';

import { language } from '../handlers/language.mjs';

const body = z.object({
  lng: z.enum(LANGUAGES),
});

export default [
  {
    method: 'POST',
    url: '/session/language',
    handler: language,
    schema: {
      body: z.toJSONSchema(body, { target: 'draft-7' }),
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
