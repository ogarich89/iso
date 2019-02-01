import path from 'path';
import fs from 'fs';
import merge from 'webpack-merge';
import { common, loaders } from './common.config';
import webpack from 'webpack';

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => nodeModules[mod] = `commonjs ${mod}`);

export default merge(common, {
  context: path.resolve(__dirname, '../../src/server'),
  entry: {
    server: './index.jsx'
  },
  target: 'node',
  node: {
    __dirname: false
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        exclude: /node_modules/,
        use: loaders({ modules: true, isServer: true })
      },
      {
        test: /\.(css)$/,
        use: loaders({ modules: false, isServer: true })
      }
    ]
  },
  externals: nodeModules,
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
});
