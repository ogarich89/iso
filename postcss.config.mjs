import purgecss from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import combineMediaQuery from 'postcss-combine-media-query';
import postcssImport from 'postcss-import';

const isProduction = process.env.NODE_ENV === 'production';

const toKebab = (token) => token.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

const extractor = (content) => {
  const tokens = content.match(/[A-Za-z0-9_-]+/g) || [];
  return [...tokens, ...tokens.map(toKebab)];
};

export default {
  plugins: [
    postcssImport(),
    combineMediaQuery(),
    autoprefixer(),
    cssnano(),
    ...(isProduction
      ? [
          purgecss({
            content: ['./index.html', './src/**/*.{ts,tsx}'],
            defaultExtractor: extractor,
            safelist: {
              standard: ['hidden', 'icon', 'container', 'active', 'dark'],
              greedy: [/^_/],
            },
            fontFace: false,
            keyframes: false,
            variables: false,
          }),
        ]
      : []),
  ],
};
