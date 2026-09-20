const { env } = process;

const toBool = (value, fallback = false) => (value === undefined ? fallback : /^(1|true|yes|on)$/i.test(value));

const toNum = (value, fallback) => (value === undefined || value === '' ? fallback : Number(value));

const certificate = env.CERT_KEY && env.CERT_CERT ? { key: env.CERT_KEY, cert: env.CERT_CERT } : undefined;

export const config = {
  port: toNum(env.PORT, 3000),
  api: env.API || 'https://reqres.in',
  apiKey: env.API_KEY || '',
  sessionRedisDb: toNum(env.SESSION_REDIS_DB, undefined),
  withStatic: toBool(env.WITH_STATIC, true),
  withRedis: toBool(env.WITH_REDIS, false),
  logger: toBool(env.LOGGER, false),
  sentryDSN: env.SENTRY_DSN || undefined,
  certificate,
};
