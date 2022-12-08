import ESLintPlugin from 'eslint-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import config from '../config.cjs';
const {
  server: { production },
} = config;
const isDevelopment = !production;

const __dirname = dirname(fileURLToPath(import.meta.url));

const common = ({ isServer } = {}) => ({
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      images: resolve(__dirname, '../../src/shared/images'),
      client: resolve(__dirname, '../../src/client'),
      server: resolve(__dirname, '../../src/server'),
      shared: resolve(__dirname, '../../src/shared'),
      types: resolve(__dirname, '../../src/types/index.ts'),
      i18n: resolve(__dirname, '../../i18n.cjs'),
      config: resolve(__dirname, '../../config/config.cjs'),
    },
  },
  devtool: isDevelopment ? 'cheap-module-source-map' : false,
  stats: {
    assets: true,
    modules: false,
    hash: false,
    children: false,
    warnings: true,
  },
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        loader: 'swc-loader',
        options: {
          sourceMap: isDevelopment,
          jsc: {
            experimental: {
              plugins: [['@swc/plugin-loadable-components', {}]],
            },
            parser: {
              syntax: 'typescript',
              tsx: true,
              dynamicImport: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(scss|sass|css)$/,
        use: [
          ...(!isServer ? [MiniCssExtractPlugin.loader] : []),
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment,
              modules: {
                auto: (resourcePath) => !resourcePath.endsWith('.css'),
                localIdentName: isDevelopment
                  ? '[local]_[hash:base64:5]'
                  : '[hash:base64:5]',
                exportOnlyLocals: isServer,
                exportLocalsConvention: 'camelCaseOnly',
              },
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'compressed',
                includePaths: [
                  resolve(__dirname, '../../src/shared/helpers/styles'),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        issuer: /\.(tsx|jsx)$/,
        exclude: /node_modules/,
        loader: 'svg-react-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        issuer: /\.(ts|tsx|js|jsx)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',
              limit: 8192,
              emitFile: !isServer,
              name: isDevelopment ? '[name].[ext]' : '[name].[hash:8].[ext]',
              outputPath: 'assets',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
      isDevelopment,
      timestamp: JSON.stringify(+new Date()),
    }),
    new webpack.LoaderOptionsPlugin({
      options: { failOnError: !isDevelopment },
    }),
    new ESLintPlugin(),
  ],
});

export { common };
