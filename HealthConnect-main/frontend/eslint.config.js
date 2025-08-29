import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default {
  extends: [js.configs.recommended],
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  },
  env: {
    browser: true,
    es2020: true,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  ignorePatterns: ['dist'],
};
