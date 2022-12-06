import path, {dirname} from 'path';
import { merge } from 'webpack-merge';
import { common } from './common.config.mjs';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import {fileURLToPath} from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default merge(common({ isServer: true }), {
  context: path.resolve(__dirname, '../../src/server'),
  entry: './request-handler.tsx',
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
    filename: 'request-handler.cjs',
    libraryTarget: 'commonjs-static',
    publicPath: '/'
  },
  externals: ['@loadable/component', nodeExternals()],
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
  ]
});
