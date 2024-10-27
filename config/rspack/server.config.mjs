import rspack from '@rspack/core';
import { merge } from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { common } from './common.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default merge(common({ isServer: true }), {
  context: resolve(__dirname, '../../src/root'),
  entry: './server.tsx',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  optimization: {
    splitChunks: false,
  },
  output: {
    library: {
      type: 'commonjs-module',
    },
    path: resolve(__dirname, '../../dist'),
    filename: 'request-handler.cjs',
    publicPath: '/',
  },
  externals: ['@loadable/component', nodeExternals()],
  plugins: [new rspack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })],
});
