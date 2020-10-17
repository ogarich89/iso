import path from 'path';
import { merge } from 'webpack-merge';
import { common } from './common.config';
import LoadablePlugin from '@loadable/webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import glob from 'glob';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';

import config from '../config';
const { server: { production } } = config;
const isDevelopment = !production;

export default merge(common, {
  context: path.resolve(__dirname, '../../src/client'),
  entry: {
    bundle: './index.tsx'
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: isDevelopment ? '[name].js' : '[name].[hash].js',
    chunkFilename: isDevelopment ? '[name].js' : '[name].[hash].js',
    publicPath: '/'
  },
  optimization: {
    splitChunks: !isDevelopment ? {
      chunks: 'all',
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      maxSize: 100000
    } : false
  },
  plugins: [
    new StyleLintPlugin({
      syntax: 'scss',
      context: path.resolve(__dirname, '../../src'),
      failOnError: !isDevelopment
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css'
    }),
    new LoadablePlugin(),
    new CleanWebpackPlugin({
      verbose: true,
      dry: false
    }),
    new ImageminPlugin({
      disable: isDevelopment,
      cacheFolder: path.resolve(__dirname, '../../.cache'),
      pngquant: {
        quality: '70'
      },
      optipng: {
        optimizationLevel: 7
      },
      jpegtran: {
        progressive: true
      },
      svgo: {
        plugins: [
          { removeViewBox: false }
        ]
      },
      externalImages: {
        context: path.resolve(__dirname, '../../'),
        sources: glob.sync('dist/images/**/*.*')
      }
    })
  ]
});
