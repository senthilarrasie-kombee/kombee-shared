/* eslint.config.mjs */

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier'; /* This must be imported! */
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'vendor/**', 'android/**', 'ios/**', '.bundle/**', 'Gemfile', 'Gemfile.lock'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        jest: true,
        __DEV__: 'readonly',
      },
    },
    plugins: {
      react,
      'react-native': reactNative,
      prettier: prettierPlugin /* This must be declared */,
    },
    rules: {
      'prettier/prettier': 'warn' /* Now this will work */,
      'no-console': ['error', {allow: ['warn', 'error']}],
      'react-native/no-inline-styles': 'warn',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: [
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
      '**/*.test.{js,jsx,ts,tsx}',
      '**/jest.setup.ts',
      '**/jest.*.config.js',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  prettier,
];
