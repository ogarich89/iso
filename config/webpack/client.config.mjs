import LoadablePlugin from '@loadable/webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { config } from '../config.cjs';

import { common } from './common.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { analyze, withStatic } = config;
const isDevelopment = process.env.NODE_ENV !== 'production';
const { default: ReactRefreshWebpackPlugin } = isDevelopment
  ? await import('@pmmmwh/react-refresh-webpack-plugin')
  : { default: null };

export default merge(common(), {
  context: resolve(__dirname, '../../src/root'),
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
      new TerserPlugin({
        minify: TerserPlugin.swcMinify,
        terserOptions: {
          compress: true,
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    splitChunks: !isDevelopment
      ? {
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            common: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
          chunks: 'all',
          maxInitialRequests: 30,
          maxAsyncRequests: 30,
          maxSize: 250000,
        }
      : false,
  },
  plugins: [
    ...(analyze
      ? [
          new BundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerMode: 'static',
          }),
        ]
      : []),
    new MiniCssExtractPlugin({
      filename: isDevelopment
        ? 'css/[name].css'
        : 'css/[name].[contenthash].css',
      chunkFilename: isDevelopment
        ? 'css/[name].css'
        : 'css/[name].[contenthash].css',
    }),
    new LoadablePlugin({ writeToDisk: true }),
    ...(isDevelopment
      ? [
          new ReactRefreshWebpackPlugin(),
          new webpack.HotModuleReplacementPlugin(),
        ]
      : []),
  ],
});
