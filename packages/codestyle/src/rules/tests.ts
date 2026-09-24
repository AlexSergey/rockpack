import type { Linter } from 'eslint';

import jestPlugin from 'eslint-plugin-jest';
import globals from 'globals';

export const makeTestConfigs = (): Linter.Config[] => {
  const testOverrides: Linter.Config = {
    files: ['**/*.spec.{ts,tsx}', '**/__fixtures__/**'],
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
      'jest/no-disabled-tests': 'error',
      'jest/no-focused-tests': 'error',
      'jest/prefer-to-have-length': 'error',
      'jest/valid-expect': 'error',
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
