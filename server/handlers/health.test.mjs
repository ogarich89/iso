import { health } from './health.mjs';

describe('health', () => {
  it('should answer with the payload instead of sending it', async () => {
    await expect(health()).resolves.toEqual({ status: 'ok' });
  });
});
