import { existsSync } from 'node:fs';
import path from 'node:path';

export const pathToEslintrc = (root: string): false | string => {
  let eslintRc: false | string = false;

  for (const ext of ['.js', '.json', '.mjs', '.cjs']) {
    if (existsSync(path.resolve(root, `eslint.config${ext}`))) {
      eslintRc = path.resolve(root, `eslint.config${ext}`);
    }
  }

  return eslintRc;
};
