import type { Linter } from 'eslint';

import reactPlugin from '@eslint-react/eslint-plugin';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import testingLibraryPlugin from 'eslint-plugin-testing-library';

import { sourceFiles } from './globs.js';

const reactTestFiles = ['**/*.{spec,test}.{ts,tsx}'];

export const makeReactConfig = (hasReact: boolean): Linter.Config =>
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
    : {};

// Testing Library and jest-dom rules for the component tests of React projects.
export const makeReactTestConfigs = (hasReact: boolean): Linter.Config[] =>
  hasReact
    ? [
        { ...testingLibraryPlugin.configs['flat/react'], files: reactTestFiles },
        { ...jestDomPlugin.configs['flat/recommended'], files: reactTestFiles },
      ]
    : [];
