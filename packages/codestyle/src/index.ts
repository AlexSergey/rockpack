import type { Linter } from 'eslint';

import { isString, readPackageJson } from '@rockpack/utils';
import gitignore from 'eslint-config-flat-gitignore';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { makeFileTypeConfigs, makeOverrideConfigs } from './rules/files.js';
import { makeReactConfig, makeReactTestConfigs } from './rules/react.js';
import { makeStyleConfigs } from './rules/style.js';
import { makeTestConfigs } from './rules/tests.js';
import { makeRecommendedTypescriptConfigs, makeTypescriptConfig } from './rules/typescript.js';

const FLAT_IGNORE_FILE = '.eslintflatignore';

const findFlatIgnoreFile = (startDir: string): string | undefined => {
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
};

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

export type MakeConfigOptions = {
  // Path to the ignore file, relative to the working directory; `false` turns ignore files off.
  readonly ignoreFile?: false | string;
  // Adds the Jest globals and rules for specs and fixtures, and the Testing Library and jest-dom rules of React
  // projects; `true` by default.
  readonly jest?: boolean;
  // Enables the React rules; detected from `react` in package.json dependencies by default.
  readonly react?: boolean;
  // Path to the tsconfig for type-aware linting, relative to the working directory.
  readonly tsconfig?: string;
};

const resolveIgnoreFile = (root: string, ignoreFile: false | string | undefined): string | undefined => {
  if (ignoreFile === false) {
    return undefined;
  }

  return isString(ignoreFile) ? path.resolve(root, ignoreFile) : findFlatIgnoreFile(root);
};

export const makeConfig = ({ ignoreFile, jest = true, react, tsconfig }: MakeConfigOptions = {}): Linter.Config[] => {
  const root = process.cwd();
  const flatIgnoreFile = resolveIgnoreFile(root, ignoreFile);
  const hasReact = react ?? isString(readPackageJson(root)?.dependencies?.['react']);

  return [
    ...(flatIgnoreFile ? [gitignore({ files: flatIgnoreFile, strict: false })] : []),
    ...makeRecommendedTypescriptConfigs(),
    ...makeStyleConfigs(),
    makeTypescriptConfig(isString(tsconfig) ? path.resolve(root, tsconfig) : findTsConfig(root), root),
    ...makeFileTypeConfigs(),
    ...makeReactConfig(hasReact),
    ...makeOverrideConfigs(),
    ...(jest ? [...makeTestConfigs(), ...makeReactTestConfigs(hasReact)] : []),
  ];
};
