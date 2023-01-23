declare module 'config' {
  export const config: {
    port: number;
    api: string;
    production?: boolean;
    browserSyncPort?: number;
    sessionRedisDb?: number;
    withStatic?: boolean;
    withRedis?: boolean;
    inspect?: boolean;
    logger?: boolean;
    sentryDSN?: string;
    certificate?: {
      key: string;
      cert: string;
    };
  };
}
