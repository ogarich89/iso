import webpack from 'webpack';
import config from '../config';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
const { server: { production } } = config;
const isDevelopment = !production;

const common = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      images: path.resolve(__dirname, '../../public/images'),
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
  optimization: {
    splitChunks: false
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.(svg)$/,
        use: [
          {
            loader: 'svg-inline-loader?idPrefix&classPrefix'
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
    new webpack.LoaderOptionsPlugin({ options: { failOnError: !isDevelopment } })
  ]
};

const loaders = (() => ({ modules = false, isServer = false }) => {
  const arr = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: isDevelopment,
        modules: modules ? {
          localIdentName: '[local]_[hash:base64:5]'
        } : false,
        onlyLocals: isServer,
        importLoaders: 2,
        localsConvention: 'camelCase'
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
        sourceMap: isDevelopment,
        outputStyle: 'compressed',
        includePaths: [path.resolve(__dirname, '../../src/shared/helpers/styles')]
      }
    }
  ];

  if(!isServer) {
    arr.unshift(MiniCssExtractPlugin.loader);
  }
  return arr;
})();

export { common, loaders };
