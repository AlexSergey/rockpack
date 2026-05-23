import type { ESLint, Linter } from 'eslint';

import reactPlugin from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import json from '@eslint/json';
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import checkFile from 'eslint-plugin-check-file';
import importLite from 'eslint-plugin-import-lite';
import noOnlyTests from 'eslint-plugin-no-only-tests';
import packageJsonConfig from 'eslint-plugin-package-json';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import regexpPlugin from 'eslint-plugin-regexp';
import sonar from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import tseslint from 'typescript-eslint';

interface PackageJson {
  readonly dependencies?: Readonly<Record<string, string>>;
}

const ignores = [
  '.idea',
  '.last-run.json',
  '**/*.d.ts',
  '*.d.ts',
  'node_modules',
  'logs',
  '*.log',
  'lib-cov/',
  'coverage/',
  'coverage-e2e/',
  'NO_COMMIT/',
  'test-reports/**',
  'docs/*',
  'build/*',
  'lib/*',
  'dist/*',
  'example/*',
  '*.css',
  '*.scss',
  '*.less',
  '*.ico',
  '*.jpg',
  '*.jpeg',
  '*.png',
  '*.svg',
  '*.bmp',
  '*.gif',
  '*.webp',
  '*.woff',
  '*.woff2',
  '*.txt',
  '*.mdx',
  '*.md',
  '*.ejs',
  '*.hbs',
  '*.jade',
  '*.html',
  'docs/',
  'public/',
  'seo_report',
  '**/.last-run.json',
];

const jsFiles = ['**/*.{js,jsx,mjs,cjs}'];
const tsFiles = ['**/*.{ts,tsx}'];
const sourceFiles = ['**/*.{js,jsx,mjs,cjs,ts,tsx}'];

export const isString = (value: unknown): value is string => typeof value === 'string';

export const makeConfig = (): Linter.Config[] => {
  const root = process.cwd();
  const packageJsonPath = path.resolve(root, 'package.json');

  let packageJson: PackageJson = {};
  if (existsSync(packageJsonPath)) {
    try {
      packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as PackageJson;
    } catch {
      // ignore malformed package.json
    }
  }

  const hasReact = isString(packageJson.dependencies?.react);

  let tsConfig: false | string = false;

  if (existsSync(path.resolve(root, './tsconfig.json'))) {
    tsConfig = path.resolve(root, './tsconfig.json');
  }

  if (existsSync(path.resolve(root, './tsconfig.eslint.json'))) {
    tsConfig = path.resolve(root, './tsconfig.eslint.json');
  }

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

  const customTypescriptConfig: Linter.Config = {
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
      '@typescript-eslint': tseslintPlugin as unknown as ESLint.Plugin,
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
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: ['UPPER_CASE', 'StrictPascalCase'],
          selector: 'interface',
        },
        {
          format: ['PascalCase'],
          selector: 'typeLike',
        },
        {
          format: ['UPPER_CASE', 'StrictPascalCase'],
          selector: 'class',
        },
      ],
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          ignoreRestSiblings: false,
          vars: 'all',
        },
      ],
      '@typescript-eslint/return-await': 'off',

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
  };

  const recommendedTypeScriptConfigs: Linter.Config[] = [
    ...tseslint.configs.recommended.map((config) => ({
      ...config,
      files: tsFiles,
    })),
    ...tseslint.configs.stylistic.map((config) => ({
      ...config,
      files: tsFiles,
    })),
    ...tseslint.configs.recommendedTypeChecked.map((config) => ({
      ...config,
      files: tsFiles,
    })),
  ] as Linter.Config[];

  const jsonCustomConfig: Linter.Config = {
    ...json.configs.recommended,
    files: ['**/*.json'],
    ignores: ['**/*-lock.json', 'package.json'],
    language: 'json/json',
  };

  const customPackageJsonConfig: Linter.Config = {
    files: ['package.json'],
    ignores: ['**/*-lock.json'],
    rules: {
      'package-json/require-exports': 'off',
      'package-json/require-files': 'off',
      'package-json/require-repository': 'off',
      'package-json/require-sideEffects': 'off',
      'package-json/require-type': 'off',
    },
  };

  const customJsConfig: Linter.Config = {
    files: jsFiles,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
      },
    },
    ...js.configs.recommended,
  };

  const perfectionistConfig: Linter.Config = {
    files: sourceFiles,
    ...perfectionist.configs['recommended-natural'],
  };

  const regexpConfig: Linter.Config = {
    files: sourceFiles,
    ...regexpPlugin.configs['flat/recommended'],
  };

  const disableDefaultExportBlockingForStorybook: Linter.Config = {
    files: [
      '**/*.stories.@(js|jsx|ts|tsx|mdx)',
      '**/playwright*.config.ts',
      '**/.storybook/**',
      '**/vite.config.ts',
      '**/vitest.config.ts',
    ],
    rules: {
      '@import-lite/no-default-export': 'off',
    },
  };

  return [
    globalIgnores(ignores),
    ...recommendedTypeScriptConfigs,
    prettierRecommended,
    perfectionistConfig,
    regexpConfig,
    customTypescriptConfig,
    jsonCustomConfig,
    packageJsonConfig.configs.recommended,
    customPackageJsonConfig,
    packageJsonConfig.configs.stylistic,
    customJsConfig,
    hasReact
      ? {
          settings: {
            react: {
              version: 'detect',
            },
          },
          ...reactHooksPlugin.configs.flat.recommended,
          ...reactPlugin.configs['recommended-typescript'],
          files: sourceFiles,
        }
      : {},
    disableDefaultExportBlockingForStorybook,
  ];
};
