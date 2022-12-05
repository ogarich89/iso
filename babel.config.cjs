module.exports = function(api) {
  api.cache(false);

  const presets = [
    '@babel/preset-typescript',
    ['@babel/preset-react', {
      'runtime': 'automatic'
    }]
  ];
  const plugins = [
    '@loadable/babel-plugin'
  ];
  const comments = true;

  if(process.env.BABEL_ENV !== 'server') {
    plugins.push(['@babel/plugin-transform-runtime', { corejs: 3 }]);
    presets.push(['@babel/preset-env', {
      useBuiltIns: 'entry',
      corejs: 3
    }]);
  }

  return { presets, plugins, comments };
};
