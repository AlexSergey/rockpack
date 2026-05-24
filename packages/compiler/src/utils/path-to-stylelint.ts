import { existsSync } from 'node:fs';
import path from 'node:path';

export const pathToStylelint = (root: string): false | string => {
  let stylelint: false | string = false;

  if (existsSync(path.resolve(root, '.stylelintrc'))) {
    stylelint = path.resolve(root, '.stylelintrc');
  }
  if (existsSync(path.resolve(root, 'stylelint.config.js'))) {
    stylelint = path.resolve(root, 'stylelint.config.js');
  }

  return stylelint;
};
