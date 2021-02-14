import path from 'path';
import fs from 'fs';
import { merge } from 'webpack-merge';
import { common } from './common.config';
import LoadablePlugin from '@loadable/webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import glob from 'glob';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import config from '../config';
const { server: { production } } = config;
const isDevelopment = !production;

try {
  fs.rmdirSync(path.resolve(__dirname, '../../dist'), { recursive: true });
} catch (e) {
  console.error(e);
}

export default merge(common, {
  context: path.resolve(__dirname, '../../src/client'),
  entry: {
    bundle: './index.tsx'
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: isDevelopment ? '[name].js' : '[name].[fullhash].js',
    chunkFilename: isDevelopment ? '[name].js' : '[name].[chunkhash].js',
    publicPath: '/'
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
      syntax: 'scss',
      context: path.resolve(__dirname, '../../src'),
      failOnError: !isDevelopment
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css'
    }),
    new LoadablePlugin(),
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
