import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  for (const [key, value] of Object.entries(loadEnv(mode, root, ''))) {
    process.env[key] ??= value;
  }

  const { config } = await import('./config/index.mjs');

  return {
    root,
    publicDir: false,
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        src: resolve(root, 'src'),
        i18n: resolve(root, 'config/i18n.mjs'),
        variables: resolve(root, 'src/styles/variables.scss'),
        mixins: resolve(root, 'src/styles/mixins.scss'),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    define: {
      'import.meta.env.VITE_API': JSON.stringify(config.api),
      'import.meta.env.VITE_API_KEY': JSON.stringify(config.apiKey),
      'import.meta.env.VITE_SENTRY_DSN': JSON.stringify(config.sentryDSN ?? ''),
      'import.meta.env.VITE_PORT': JSON.stringify(String(config.port)),
    },
    build: {
      sourcemap: true,
    },
  };
});
