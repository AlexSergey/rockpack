import type { Linter } from 'eslint';

import reactPlugin from '@eslint-react/eslint-plugin';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import testingLibraryPlugin from 'eslint-plugin-testing-library';

import { sourceFiles, testFiles } from './globs.js';

// Separate blocks: spreading both presets into one object kept only the plugins and rules of the last one.
export const makeReactConfig = (hasReact: boolean): Linter.Config[] =>
  hasReact
    ? [
        {
          ...reactPlugin.configs['recommended-typescript'],
          files: sourceFiles,
          rules: {
            ...reactPlugin.configs['recommended-typescript'].rules,
            // react-hooks/rules-of-hooks reports the same problems.
            '@eslint-react/rules-of-hooks': 'off',
          },
        },
        { ...reactHooksPlugin.configs.flat.recommended, files: sourceFiles },
      ]
    : [];

// Testing Library and jest-dom rules for the component tests of React projects.
export const makeReactTestConfigs = (hasReact: boolean): Linter.Config[] =>
  hasReact
    ? [
        {
          ...testingLibraryPlugin.configs['flat/react'],
          files: testFiles,
          // Only report in files that import Testing Library: Playwright specs share the getBy* names.
          settings: {
            'testing-library/custom-queries': 'off',
            'testing-library/custom-renders': 'off',
            'testing-library/utils-module': 'off',
          },
        },
        { ...jestDomPlugin.configs['flat/recommended'], files: testFiles },
      ]
    : [];
