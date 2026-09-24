import type { Linter } from 'eslint';

import reactPlugin from '@eslint-react/eslint-plugin';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

import { sourceFiles } from './globs.js';

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
