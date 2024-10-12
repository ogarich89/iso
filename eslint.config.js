import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsEslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2015,
        ...globals.jest,
        ...globals.node,
        ...globals.commonjs,
        isDevelopment: true,
        timestamp: true,
      },
    },
    plugins: {
      react,
      import: importPlugin,
      prettier: eslintPluginPrettier,
      '@typescript-eslint': tsEslint.plugin,
    },
  },
  prettierRecommended,
  ...tsEslint.config(
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
  ),
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }],
      'import/order': [
        'error',
        {
          groups: [
            'external',
            'internal',
            'builtin',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            {
              pattern: '**/*.scss',
              group: 'object',
              position: 'before',
            },
            {
              pattern: '**/*.css',
              group: 'object',
            },
            {
              pattern: 'client/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: 'server/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: 'shared/**',
              group: 'internal',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['type'],
          warnOnUnassignedImports: true,
        },
      ],
      'import/no-duplicates': ['error'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/class-name-casing': 'off',
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': 0,
      'linebreak-style': ['error', 'unix'],
      'jsx-quotes': ['error', 'prefer-double'],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-key': 2,
      eqeqeq: 2,
      'object-curly-spacing': ['error', 'always'],
      'prefer-destructuring': [
        'error',
        {
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'no-eval': 2,
      'no-multi-str': 2,
      'prefer-const': [
        'error',
        {
          destructuring: 'any',
          ignoreReadBeforeAssign: false,
        },
      ],
      'max-len': ['error', { code: 120, ignorePattern: '^import .*' }],
    },
  },
  {
    ignores: ['dist/**', 'coverage/**', 'public/**'],
  },
];
