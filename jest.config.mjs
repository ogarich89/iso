export default {
  roots: ['<rootDir>'],
  setupFiles: ['<rootDir>/config/jest.setup.cjs'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      '@swc/jest',
      {
        jsc: {
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
          target: 'es2015',
        },
      },
    ],
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
};
