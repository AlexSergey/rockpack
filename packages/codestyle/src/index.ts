import type { Linter } from 'eslint';

import { readPackageJson } from '@rockpack/utils';
import gitignore from 'eslint-config-flat-gitignore';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { makeFileTypeConfigs, makeOverrideConfigs } from './rules/files.js';
import { makeReactConfig } from './rules/react.js';
import { makeStyleConfigs } from './rules/style.js';
import { makeTestConfigs } from './rules/tests.js';
import { makeRecommendedTypescriptConfigs, makeTypescriptConfig } from './rules/typescript.js';

const FLAT_IGNORE_FILE = '.eslintflatignore';

function findFlatIgnoreFile(startDir: string): string | undefined {
  let dir = startDir;
  for (;;) {
    const candidate = path.join(dir, FLAT_IGNORE_FILE);
    if (existsSync(candidate)) {
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return undefined;
    }
    dir = parent;
  }
}

// tsconfig.eslint.json wins over tsconfig.json.
const findTsConfig = (root: string): false | string => {
  for (const name of ['tsconfig.eslint.json', 'tsconfig.json']) {
    const candidate = path.resolve(root, name);
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return false;
};

export const isString = (value: unknown): value is string => typeof value === 'string';

export const makeConfig = (): Linter.Config[] => {
  const root = process.cwd();
  const packageJson = readPackageJson(root) ?? {};
  const flatIgnoreFile = findFlatIgnoreFile(root);

  return [
    ...(flatIgnoreFile ? [gitignore({ files: flatIgnoreFile, strict: false })] : []),
    ...makeRecommendedTypescriptConfigs(),
    ...makeStyleConfigs(),
    makeTypescriptConfig(findTsConfig(root)),
    ...makeFileTypeConfigs(),
    makeReactConfig(isString(packageJson.dependencies?.['react'])),
    ...makeOverrideConfigs(),
    ...makeTestConfigs(),
  ];
};
