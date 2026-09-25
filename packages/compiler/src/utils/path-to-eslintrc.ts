import { existsSync } from 'node:fs';
import path from 'node:path';

// ESLint flat config names in the order ESLint itself looks them up, TypeScript included.
const ESLINT_CONFIGS = [
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
  'eslint.config.ts',
  'eslint.config.mts',
  'eslint.config.cts',
];

export const pathToEslintrc = (root: string): false | string => {
  const found = ESLINT_CONFIGS.map((name) => path.resolve(root, name)).find((file) => existsSync(file));

  return found ?? false;
};
