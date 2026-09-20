import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
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
    'import.meta.env.VITE_API': JSON.stringify('https://reqres.in'),
    'import.meta.env.VITE_API_KEY': JSON.stringify('test-api-key'),
    'import.meta.env.VITE_PORT': JSON.stringify('3000'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./config/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
    },
  },
});
