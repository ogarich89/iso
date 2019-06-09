module.exports = function(api) {
  api.cache(false);

  const presets = [
    '@babel/preset-react',
    '@babel/preset-flow'
  ];
  const plugins = [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-syntax-dynamic-import',
    '@loadable/babel-plugin',
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
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
    presets.push('@babel/preset-env');
  } else {
    plugins.push(...[
      '@babel/plugin-transform-modules-commonjs',
      '@babel/plugin-proposal-object-rest-spread',
    ]);
  }

  return { presets, plugins, comments };
};
