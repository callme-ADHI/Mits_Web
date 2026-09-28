import eslint from '../superadmin/node_modules/@eslint/js/src/index.js';
import tseslint from '../superadmin/node_modules/typescript-eslint/dist/index.js';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'bin/**', 'node_modules/**', '*.config.*'],
  }
];
