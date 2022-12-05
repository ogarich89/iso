import path, {dirname} from 'path';
import { merge } from 'webpack-merge';
import { common } from './common.config.mjs';
import LoadablePlugin from '@loadable/webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __dirname = dirname(fileURLToPath(import.meta.url));

import config from '../config.cjs';
import {fileURLToPath} from "url";
const { server: { production } } = config;
const isDevelopment = !production;

export default merge(common, {
  context: path.resolve(__dirname, '../../src/client'),
  entry: {
    bundle: './index.tsx'
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: isDevelopment ? 'js/[name].js' : 'js/[name].[contenthash].js',
    chunkFilename: isDevelopment ? 'js/[name].js' : 'js/[name].[contenthash].js',
    publicPath: '/',
    assetModuleFilename: isDevelopment ? 'assets/[name].[ext]' : 'assets/[name].[hash:8].[ext]',
    clean: true,
  },
  optimization: {
    splitChunks: !isDevelopment ? {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        common: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      },
      chunks: 'all',
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      maxSize: 250000
    } : false
  },
  plugins: [
    ...(isDevelopment ? [new BundleAnalyzerPlugin({ openAnalyzer: false, analyzerMode: 'static' })] : []),
    new StyleLintPlugin({
      customSyntax: 'postcss-scss',
      context: path.resolve(__dirname, '../../src'),
      failOnError: !isDevelopment
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? 'css/[name].css' : 'css/[name].[contenthash].css',
      chunkFilename: isDevelopment ? 'css/[name].css' : 'css/[name].[contenthash].css'
    }),
    new LoadablePlugin(),
  ]
});
