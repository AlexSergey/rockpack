import type { Linter } from 'eslint';

import perfectionist from 'eslint-plugin-perfectionist';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import regexpPlugin from 'eslint-plugin-regexp';

import { sourceFiles } from './globs.js';

export const makeStyleConfigs = (): Linter.Config[] => {
  const perfectionistConfig: Linter.Config = {
    files: sourceFiles,
    ...perfectionist.configs['recommended-natural'],
  };

  const regexpConfig: Linter.Config = {
    files: sourceFiles,
    ...regexpPlugin.configs['flat/recommended'],
  };

  return [prettierRecommended, perfectionistConfig, regexpConfig];
};
