import path from 'path';
import { merge } from 'webpack-merge';
import { common } from './common.config';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

export default merge(common, {
  context: path.resolve(__dirname, '../../src/server'),
  entry: {
    server: './index.tsx'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  optimization: {
    splitChunks: false
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
    publicPath: '/'
  },
  externals: ['@loadable/component', nodeExternals()],
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
  ]
});
