import type { Linter } from 'eslint';

import tsParser from '@typescript-eslint/parser';
import checkFile from 'eslint-plugin-check-file';
import importLite from 'eslint-plugin-import-lite';
import noOnlyTests from 'eslint-plugin-no-only-tests';
import sonar from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { tsFiles } from './globs.js';

const languageOptions: Linter.Config['languageOptions'] = {
  ecmaVersion: 2024,
  globals: {
    ...globals.browser,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  sourceType: 'module',
};

export const makeRecommendedTypescriptConfigs = (): Linter.Config[] =>
  [
    ...tseslint.configs.strictTypeChecked.map((config) => ({
      ...config,
      files: tsFiles,
    })),
    ...tseslint.configs.stylisticTypeChecked.map((config) => ({
      ...config,
      files: tsFiles,
    })),
  ] as Linter.Config[];

export const makeTypescriptConfig = (tsConfig: false | string): Linter.Config => ({
  files: tsFiles,
  languageOptions: {
    ...languageOptions,
    parser: tsParser,
    parserOptions: {
      project: tsConfig || './tsconfig.json',
    },
  },
  plugins: {
    '@check-file': checkFile,
    '@import-lite': importLite,
    '@no-only-tests': noOnlyTests,
    '@sonar': sonar,
    '@typescript-eslint': tseslint.plugin,
    '@unicorn': unicorn,
    'import/parsers': tsParser,
  },
  rules: {
    '@check-file/filename-naming-convention': [
      'error',
      {
        'src/**/*.{ts,tsx}': 'KEBAB_CASE',
      },
      {
        ignoreMiddleExtensions: true,
      },
    ],
    '@check-file/folder-naming-convention': [
      'error',
      {
        'src/**/': 'KEBAB_CASE',
      },
    ],

    '@import-lite/no-default-export': 'error',

    '@no-only-tests/no-only-tests': 'error',

    '@sonar/cognitive-complexity': ['error', 20],
    '@sonar/no-collapsible-if': 'error',
    '@sonar/no-identical-expressions': 'error',
    '@sonar/no-identical-functions': 'error',
    '@sonar/no-inverted-boolean-check': 'error',
    '@sonar/no-redundant-boolean': 'error',
    '@sonar/no-small-switch': 'error',
    '@sonar/no-unused-collection': 'error',
    '@sonar/prefer-immediate-return': 'error',

    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['PascalCase'],
        selector: 'typeLike',
      },
      {
        format: ['UPPER_CASE', 'StrictPascalCase'],
        selector: 'class',
      },
    ],
    '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
    // Records used as dictionaries (collections, process.env) are deleted from by key.
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        ignoreRestSiblings: false,
        vars: 'all',
      },
    ],
    // Conflicts with no-non-null-assertion from the strict preset: keep explicit `as` casts.
    '@typescript-eslint/non-nullable-type-assertion-style': 'off',
    // An empty string means "not set" in configs, so `||` stays allowed for strings.
    '@typescript-eslint/prefer-nullish-coalescing': ['error', { ignorePrimitives: { string: true } }],
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',

    '@unicorn/no-useless-undefined': ['error', { checkArguments: false, checkArrowFunctionBody: false }],
    '@unicorn/prefer-array-flat': 'error',
    '@unicorn/prefer-modern-dom-apis': 'error',
    '@unicorn/prefer-node-protocol': 'error',
    '@unicorn/prefer-string-starts-ends-with': 'error',
    '@unicorn/throw-new-error': 'error',

    'array-callback-return': [
      'error',
      {
        allowImplicit: true,
      },
    ],
    camelcase: ['error', { properties: 'always' }],
    'class-methods-use-this': 'off',
    'getter-return': [
      'error',
      {
        allowImplicit: true,
      },
    ],
    'newline-before-return': 'error',
    'no-alert': 'error',
    'no-await-in-loop': 'off',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-return-await': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'off',
    'no-warning-comments': 'warn',
  },
});
