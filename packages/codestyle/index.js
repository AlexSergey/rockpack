import reactPlugin from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import json from '@eslint/json';
import { getMode } from '@rockpack/utils';
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
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import tseslint from 'typescript-eslint';

const ignores = [
  '.idea',
  '**/*.d.ts',
  '*.d.ts',
  'node_modules',
  'logs',
  '*.log',
  'lib-cov/',
  'coverage/',
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
  'locales/',
  'src/locales/',
  'seo_report',
  '.last-run.json',
];

const jsFiles = ['**/*.{js,jsx,mjs,cjs}'];

const tsFiles = ['**/*.{ts,tsx}'];

const sourceFiles = ['**/*.{js,jsx,mjs,cjs,ts,tsx}'];

export const isString = (value) => typeof value === 'string';

export const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

export const makeConfig = () => {
  const mode = getMode(['development', 'production'], 'production');

  const root = process.cwd();

  const packageJsonPath = path.resolve(root, 'package.json');
  const packageJson = existsSync(packageJsonPath) ? JSON.parse(readFileSync(packageJsonPath, 'utf8')) : {};
  const { hasReact } = packageJson && isObject(packageJson.dependencies) && isString(packageJson.dependencies.react);

  let tsConfig = false;

  if (existsSync(path.resolve(root, './tsconfig.js'))) {
    tsConfig = path.resolve(root, './tsconfig.js');
  }

  if (existsSync(path.resolve(root, './tsconfig.json'))) {
    tsConfig = path.resolve(root, './tsconfig.json');
  }

  if (existsSync(path.resolve(root, './tsconfig.development.js')) && mode === 'development') {
    tsConfig = path.resolve(root, './tsconfig.development.js');
  }
  if (existsSync(path.resolve(root, './tsconfig.production.js')) && mode === 'production') {
    tsConfig = path.resolve(root, './tsconfig.production.js');
  }

  const languageOptions = {
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

  const customTypescriptConfig = {
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
      '@typescript-eslint': tseslintPlugin,
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

      camelcase: ['error', { properties: 'always' }],
      'class-methods-use-this': 'off',
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

  if (hasReact) {
    Object.assign(customTypescriptConfig.rules, {
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    });
  }

  const recommendedTypeScriptConfigs = [
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
  ];

  if (hasReact) {
    customTypescriptConfig.rules['react/jsx-uses-react'] = 'off';
    customTypescriptConfig.rules['react/react-in-jsx-scope'] = 'off';
  }

  const jsonCustomConfig = {
    files: ['**/*.json'],
    ignores: ['**/*-lock.json', 'package.json'],
    language: 'json/json',
    plugins: {
      json,
    },
    ...json.configs.recommended,
  };

  const customPackageJsonConfig = {
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

  const customJsConfig = {
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

  const perfectionistConfig = {
    files: sourceFiles,
    ...perfectionist.configs['recommended-natural'],
  };

  const regexpConfig = {
    files: sourceFiles,
    ...regexpPlugin.configs['flat/recommended'],
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
          ...reactPlugin.configs['recommended-type-checked'],
          files: sourceFiles,
        }
      : {},
  ];
};
