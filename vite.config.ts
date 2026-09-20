import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import { config } from './config/index.mjs';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
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
    'import.meta.env.VITE_PORT': JSON.stringify(String(config.port)),
  },
  build: {
    sourcemap: true,
  },
});
