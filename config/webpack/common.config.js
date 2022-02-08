import webpack from 'webpack';
import config from '../config';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import path from 'path';
const { server: { production } } = config;
const isDevelopment = !production;
const isServer = process.env.BABEL_ENV === 'server';

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
  devtool: isDevelopment ? 'source-map' : false,
  stats: {
    assets  : true,
    modules : false,
    hash    : false,
    children: false,
    warnings: false
  },
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
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
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',
              limit: 8192,
              emitFile: !isServer,
              name: '[name].[hash:8].[ext]',
              outputPath: 'images'
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
