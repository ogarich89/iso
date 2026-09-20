import { parseConfig } from './index.mjs';

describe('parseConfig', () => {
  it('should fall back to defaults for an empty environment', () => {
    expect(parseConfig({})).toEqual({
      port: 3000,
      api: 'https://reqres.in',
      apiKey: '',
      sessionSecret: undefined,
      sessionRedisDb: undefined,
      withStatic: true,
      withRedis: false,
      logger: false,
      sentryDSN: undefined,
      certificate: undefined,
    });
  });

  it('should read numbers and flags out of strings', () => {
    expect(parseConfig({ PORT: '4000', WITH_REDIS: 'yes', LOGGER: 'off', SESSION_REDIS_DB: '2' })).toMatchObject({
      port: 4000,
      withRedis: true,
      logger: false,
      sessionRedisDb: 2,
    });
  });

  it('should treat an empty value as unset', () => {
    expect(parseConfig({ PORT: '', API: '' })).toMatchObject({ port: 3000, api: 'https://reqres.in' });
  });

  it('should reject a port that is not a number', () => {
    expect(() => parseConfig({ PORT: 'abc' })).toThrow(/PORT/);
  });

  it('should reject a flag that is not a boolean', () => {
    expect(() => parseConfig({ WITH_REDIS: 'ture' })).toThrow(/WITH_REDIS/);
  });

  it('should reject a session secret that is too short', () => {
    expect(() => parseConfig({ SESSION_SECRET: 'short' })).toThrow(/SESSION_SECRET/);
  });

  it('should take the certificate only as a pair', () => {
    expect(parseConfig({ CERT_KEY: '/key.pem', CERT_CERT: '/cert.pem' }).certificate).toEqual({
      key: '/key.pem',
      cert: '/cert.pem',
    });
    expect(() => parseConfig({ CERT_KEY: '/key.pem' })).toThrow(/CERT_CERT/);
  });
});
