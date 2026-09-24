import type { Linter } from 'eslint';

import js from '@eslint/js';
import json from '@eslint/json';
import packageJsonConfig from 'eslint-plugin-package-json';
import globals from 'globals';

import { jsFiles } from './globs.js';

// JSON, package.json and plain JavaScript files.
export const makeFileTypeConfigs = (): Linter.Config[] => {
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

  return [
    jsonCustomConfig,
    packageJsonConfig.configs.recommended,
    customPackageJsonConfig,
    packageJsonConfig.configs.stylistic,
    customJsConfig,
  ];
};

// Declaration files and tool config files that need default exports.
export const makeOverrideConfigs = (): Linter.Config[] => {
  const disableDefaultExportBlockingForStorybook: Linter.Config = {
    files: [
      '**/*.stories.@(js|jsx|ts|tsx|mdx)',
      '**/playwright*.config.ts',
      '**/.storybook/**',
      '**/vite.config.ts',
      '**/vitest.config.ts',
      '**/eslint.config.ts',
    ],
    rules: {
      '@import-lite/no-default-export': 'off',
    },
  };

  const dtsOverrides: Linter.Config = {
    files: ['**/*.d.ts'],
    rules: {
      '@import-lite/no-default-export': 'off',
      '@typescript-eslint/naming-convention': 'off',
    },
  };

  return [disableDefaultExportBlockingForStorybook, dtsOverrides];
};
