import { existsSync } from 'node:fs';
import path from 'node:path';

import type { Mode } from '../types.js';

export const pathToEslintrc = (root: string, mode: Mode): false | string => {
  let eslintRc: false | string = false;

  if (existsSync(path.resolve(root, '.eslintrc.js'))) {
    eslintRc = path.resolve(root, '.eslintrc.js');
  }
  if (existsSync(path.resolve(root, './.eslintrc.development.js')) && mode === 'development') {
    eslintRc = path.resolve(root, './.eslintrc.development.js');
  }
  if (existsSync(path.resolve(root, './.eslintrc.production.js')) && mode === 'production') {
    eslintRc = path.resolve(root, './.eslintrc.production.js');
  }
  if (existsSync(path.resolve(root, 'eslintrc.js'))) {
    eslintRc = path.resolve(root, 'eslintrc.js');
  }
  if (existsSync(path.resolve(root, './eslintrc.development.js')) && mode === 'development') {
    eslintRc = path.resolve(root, './eslintrc.development.js');
  }
  if (existsSync(path.resolve(root, './eslintrc.production.js')) && mode === 'production') {
    eslintRc = path.resolve(root, './eslintrc.production.js');
  }

  return eslintRc;
};
