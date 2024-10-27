import rspack from '@rspack/core';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const isDevelopment = process.env.NODE_ENV !== 'production';

const __dirname = dirname(fileURLToPath(import.meta.url));

const common = ({ isServer } = {}) => ({
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      i18n: resolve(__dirname, '../../i18n.mjs'),
      src: resolve(__dirname, '../../src'),
      config: resolve(__dirname, '../../config/config.cjs'),
    },
    ...(!isServer ? { fallback: { path: 'path-browserify' } } : {}),
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
        loader: 'builtin:swc-loader',
        options: {
          sourceMap: isDevelopment,
          env: {
            targets: {
              chrome: '94',
              safari: '15',
            },
            mode: 'usage',
            coreJs: '3.36',
          },
          jsc: {
            experimental: {
              plugins: [
                ['@swc/plugin-loadable-components', {}],
                ...(isDevelopment ? [['swc-plugin-add-display-name', {}]] : []),
              ],
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
          ...(!isServer
            ? [
                {
                  loader: rspack.CssExtractRspackPlugin.loader,
                  options: {
                    hmr: isDevelopment,
                  },
                },
              ]
            : []),
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment,
              modules: {
                namedExport: false,
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
              api: 'modern-compiler',
              sassOptions: {
                outputStyle: 'compressed',
                loadPaths: [resolve(__dirname, '../../src/helpers/styles')],
              },
            },
          },
        ],
        type: 'javascript/auto',
      },
      {
        test: /\.svg$/,
        issuer: /\.(tsx|jsx)$/,
        exclude: /node_modules/,
        loader: '@svgr/webpack',
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        issuer: /\.(ts|tsx|js|jsx)$/,
        type: 'asset',
        generator: {
          emit: !isServer,
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
      },
    ],
  },
  plugins: [
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
      isDevelopment,
      timestamp: JSON.stringify(+new Date()),
    }),
    new rspack.LoaderOptionsPlugin({
      options: { failOnError: !isDevelopment },
    }),
  ],
});

export { common };
