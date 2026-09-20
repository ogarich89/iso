import { health } from '../handlers/health.mjs';

export default [
  {
    method: 'GET',
    url: '/health',
    handler: health,
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
          },
        },
      },
    },
  },
];
