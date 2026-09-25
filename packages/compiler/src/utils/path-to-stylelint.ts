import { existsSync } from 'node:fs';
import path from 'node:path';

// The Stylelint config names in the order Stylelint itself looks them up.
const STYLELINT_CONFIGS = [
  '.stylelintrc',
  '.stylelintrc.json',
  '.stylelintrc.yaml',
  '.stylelintrc.yml',
  '.stylelintrc.js',
  '.stylelintrc.mjs',
  '.stylelintrc.cjs',
  'stylelint.config.js',
  'stylelint.config.mjs',
  'stylelint.config.cjs',
];

export const pathToStylelint = (root: string): false | string => {
  const found = STYLELINT_CONFIGS.map((name) => path.resolve(root, name)).find((file) => existsSync(file));

  return found ?? false;
};
