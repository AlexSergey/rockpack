import { existsSync } from 'node:fs';
import path from 'node:path';

import type { Mode } from '../types.js';

export const pathToTsConf = (root: string, mode: Mode, debug: boolean): false | string => {
  let tsConfig: false | string = false;

  if (existsSync(path.resolve(root, './tsconfig.js'))) {
    tsConfig = path.resolve(root, './tsconfig.js');
    if (debug && existsSync(path.resolve(root, './tsconfig.debug.js'))) {
      tsConfig = path.resolve(root, './tsconfig.debug.js');
    }
  }

  if (existsSync(path.resolve(root, './tsconfig.json'))) {
    tsConfig = path.resolve(root, './tsconfig.json');
    if (debug && existsSync(path.resolve(root, './tsconfig.debug.json'))) {
      tsConfig = path.resolve(root, './tsconfig.debug.json');
    }
  }

  if (existsSync(path.resolve(root, './tsconfig.development.js')) && mode === 'development') {
    tsConfig = path.resolve(root, './tsconfig.development.js');
  }
  if (existsSync(path.resolve(root, './tsconfig.production.js')) && mode === 'production') {
    tsConfig = path.resolve(root, './tsconfig.production.js');
  }

  return tsConfig;
};
