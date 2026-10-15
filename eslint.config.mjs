import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
const config = tseslint.config(
 {ignores:['next-env.d.ts','.npm-cache/**','.next/**','out/**','node_modules/**','test-results/**','playwright-report/**']},
 {files:['**/*.ts','**/*.tsx'],extends:[js.configs.recommended,...tseslint.configs.recommended]},
 {files:['src/**/*.tsx'],plugins:{'react-hooks':hooks,'jsx-a11y':a11y},rules:{...hooks.configs.recommended.rules,...a11y.configs.recommended.rules}},
);
export default config;
