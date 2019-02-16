import path from 'path';
import merge from 'webpack-merge';
import { common, loaders } from './common.config';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

export default merge(common, {
  context: path.resolve(__dirname, '../../src/server'),
  entry: {
    server: './index.jsx'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
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
  externals: ['@loadable/component', nodeExternals()],
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
});
