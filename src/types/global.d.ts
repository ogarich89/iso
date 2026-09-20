/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API: string;
  readonly VITE_API_KEY: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_PORT: string;
}
