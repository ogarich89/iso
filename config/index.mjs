import { z } from 'zod';

const TRUE = ['1', 'true', 'yes', 'on'];
const FALSE = ['0', 'false', 'no', 'off'];

const flag = (fallback) =>
  z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => TRUE.includes(value) || FALSE.includes(value), {
      error: `expected one of ${[...TRUE, ...FALSE].join(', ')}`,
    })
    .transform((value) => TRUE.includes(value))
    .optional()
    .default(fallback);

const schema = z
  .object({
    PORT: z.coerce.number().int().positive().default(3000),
    HOST: z.string().default('127.0.0.1'),
    API: z.url().default('https://reqres.in'),
    API_KEY: z.string().default(''),
    SESSION_SECRET: z.string().min(32).optional(),
    SESSION_REDIS_DB: z.coerce.number().int().nonnegative().optional(),
    REDIS_URL: z.string().default('redis://127.0.0.1:6379'),
    WITH_STATIC: flag(true),
    WITH_REDIS: flag(false),
    TRUST_PROXY: flag(false),
    LOGGER: flag(false),
    SENTRY_DSN: z.url().optional(),
    CERT_KEY: z.string().optional(),
    CERT_CERT: z.string().optional(),
  })
  .refine(({ CERT_KEY, CERT_CERT }) => Boolean(CERT_KEY) === Boolean(CERT_CERT), {
    error: 'CERT_KEY and CERT_CERT must be set together',
    path: ['CERT_CERT'],
  });

export const parseConfig = (env) => {
  const defined = Object.fromEntries(Object.entries(env).filter(([, value]) => value !== ''));
  const { success, data, error } = schema.safeParse(defined);

  if (!success) {
    throw new Error(`Invalid environment configuration\n${z.prettifyError(error)}`);
  }

  return {
    port: data.PORT,
    host: data.HOST,
    api: data.API,
    apiKey: data.API_KEY,
    sessionSecret: data.SESSION_SECRET,
    sessionRedisDb: data.SESSION_REDIS_DB,
    redisUrl: data.REDIS_URL,
    withStatic: data.WITH_STATIC,
    withRedis: data.WITH_REDIS,
    trustProxy: data.TRUST_PROXY,
    logger: data.LOGGER,
    sentryDSN: data.SENTRY_DSN,
    certificate: data.CERT_KEY && data.CERT_CERT ? { key: data.CERT_KEY, cert: data.CERT_CERT } : undefined,
  };
};

export const config = parseConfig(process.env);
