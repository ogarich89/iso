import webpack from 'webpack';
import config from '../config.cjs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const { server: { production } } = config;
const isDevelopment = !production;
const isServer = process.env.BABEL_ENV === 'server';

const __dirname = dirname(fileURLToPath(import.meta.url));

const common = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      images: path.resolve(__dirname, '../../src/shared/images'),
      client: path.resolve(__dirname, '../../src/client'),
      server: path.resolve(__dirname, '../../src/server'),
      shared: path.resolve(__dirname, '../../src/shared')
    }
  },
  devtool: isDevelopment ? 'cheap-module-source-map' : false,
  stats: {
    assets  : true,
    modules : false,
    hash    : false,
    children: false,
    warnings: true
  },
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
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
                localIdentName: isDevelopment ? '[local]_[hash:base64:5]' : '[hash:base64:5]',
                exportOnlyLocals: isServer,
                exportLocalsConvention: 'camelCaseOnly'
              },
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDevelopment
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'compressed',
                includePaths: [path.resolve(__dirname, '../../src/shared/helpers/styles')]
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        issuer: /\.(ts|tsx|js|jsx)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',
              limit: 8192,
              emitFile: !isServer,
              name: isDevelopment ? '[name].[ext]' : '[name].[hash:8].[ext]',
              outputPath: 'assets'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      isDevelopment,
      timestamp: JSON.stringify(+ new Date())
    }),
    new webpack.LoaderOptionsPlugin({ options: { failOnError: !isDevelopment } }),
    new ESLintPlugin()
  ]
};


export { common };
