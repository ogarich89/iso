import LoadablePlugin from '@loadable/webpack-plugin';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import rspack from '@rspack/core';
import { merge } from 'webpack-merge';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { config } from '../config.cjs';

import { common } from './common.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { analyze, withStatic } = config;
const isDevelopment = process.env.NODE_ENV !== 'production';
const { default: ReactRefreshPlugin } = isDevelopment
  ? await import('@rspack/plugin-react-refresh')
  : { default: null };

export default merge(common(), {
  context: resolve(__dirname, '../../src/root'),
  performance: {
    maxEntrypointSize: 500000,
    maxAssetSize: 500000,
  },
  entry: {
    bundle: [
      './client.tsx',
      ...(isDevelopment ? ['webpack-hot-middleware/client'] : []),
    ],
  },
  output: {
    path: resolve(__dirname, '../../dist'),
    filename: isDevelopment ? 'js/[name].js' : 'js/[name].[contenthash].js',
    chunkFilename: isDevelopment
      ? 'js/[name].js'
      : 'js/[name].[contenthash].js',
    publicPath: withStatic ? '/dist/' : '/',
    assetModuleFilename: isDevelopment
      ? 'assets/[name].[ext]'
      : 'assets/[name].[hash:8].[ext]',
    clean: true,
  },
  optimization: {
    ...(isDevelopment ? { runtimeChunk: 'single' } : {}),
    minimize: !isDevelopment,
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin({
        minimizerOptions: {
          compress: true,
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new LoadablePlugin({ writeToDisk: true }),
    new rspack.CssExtractRspackPlugin({
      filename: isDevelopment
        ? 'css/[name].css'
        : 'css/[name].[contenthash].css',
      chunkFilename: isDevelopment
        ? 'css/[name].css'
        : 'css/[name].[contenthash].css',
    }),
    ...(analyze
      ? [
          new RsdoctorRspackPlugin({
            disableClientServer: !isDevelopment,
            mode: isDevelopment ? 'normal' : 'brief',
            linter: {
              rules: {
                'ecma-version-check': 'off',
              },
            },
          }),
        ]
      : []),
    ...(isDevelopment
      ? [new ReactRefreshPlugin(), new rspack.HotModuleReplacementPlugin()]
      : []),
  ],
});
