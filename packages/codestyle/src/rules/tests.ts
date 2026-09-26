import type { Linter } from 'eslint';

import jestPlugin from 'eslint-plugin-jest';
import globals from 'globals';

import { testFiles } from './globs.js';

export const makeTestConfigs = (): Linter.Config[] => {
  const testOverrides: Linter.Config = {
    files: [...testFiles, '**/__fixtures__/**'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'jest/no-alias-methods': 'error',
      'jest/no-conditional-expect': 'error',
      'jest/no-disabled-tests': 'error',
      'jest/no-done-callback': 'error',
      'jest/no-export': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/no-interpolation-in-snapshots': 'error',
      'jest/no-jasmine-globals': 'error',
      'jest/no-mocks-import': 'error',
      'jest/no-standalone-expect': 'error',
      'jest/no-test-prefixes': 'error',
      'jest/prefer-to-have-length': 'error',
      'jest/valid-describe-callback': 'error',
      'jest/valid-expect': 'error',
      'jest/valid-expect-in-promise': 'error',
      'jest/valid-title': 'error',
    },
  };

  const fixturesOverrides: Linter.Config = {
    files: ['**/__fixtures__/**'],
    rules: {
      '@check-file/folder-naming-convention': 'off',
    },
  };

  return [testOverrides, fixturesOverrides];
};
