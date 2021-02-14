module.exports = function(api) {
  api.cache(false);

  const presets = [
    '@babel/preset-typescript',
    ['@babel/preset-react', {
      'runtime': 'automatic'
    }]
  ];
  const plugins = [
    ['@babel/plugin-transform-runtime', { corejs: 3 }],
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-syntax-dynamic-import',
    '@loadable/babel-plugin',
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-proposal-decorators', { 'decoratorsBeforeExport': true }],
    ['@babel/plugin-proposal-class-properties', { 'loose' : true }]
  ];
  const comments = true;

  if(process.env.BABEL_ENV !== 'server') {
    plugins.push(...[
      '@babel/plugin-syntax-import-meta',
      '@babel/plugin-proposal-json-strings',
      '@babel/plugin-proposal-function-sent',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-throw-expressions'
    ]);
    presets.push(['@babel/preset-env', {
      useBuiltIns: 'entry',
      corejs: 3
    }]);
  } else {
    plugins.push(...[
      '@babel/plugin-transform-modules-commonjs'
    ]);
  }

  return { presets, plugins, comments };
};
