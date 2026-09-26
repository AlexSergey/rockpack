import type { InputOptions } from '@babel/core';

import deepmerge from 'deepmerge';
import { existsSync } from 'node:fs';
import path from 'node:path';

import type { BabelMergeContext, BabelMergeFunction } from './types.js';

import { _require } from './resolve.js';

// Node 24 loads every one of them through require(): ES modules natively and TypeScript through type stripping.
const userConfigFiles = ['rockpack.babel.js', 'rockpack.babel.cjs', 'rockpack.babel.mjs', 'rockpack.babel.ts'];

const isModuleNamespace = (value: object): boolean =>
  Object.prototype.toString.call(value) === '[object Module]' || ('__esModule' in value && value.__esModule === true);

// An ES module config arrives as its namespace object, the config itself is its default export.
const unwrapDefault = (loaded: unknown): unknown =>
  typeof loaded === 'object' && loaded !== null && isModuleNamespace(loaded) && 'default' in loaded
    ? loaded.default
    : loaded;

export const applyUserConfig = (opts: InputOptions, context: BabelMergeContext, root: string): InputOptions => {
  const configFile = userConfigFiles.find((file) => existsSync(path.resolve(root, file)));

  if (configFile === undefined) {
    return opts;
  }

  try {
    const babelMergeModule = unwrapDefault(_require(path.resolve(root, configFile)));

    if (typeof babelMergeModule === 'object' && babelMergeModule !== null && Object.keys(babelMergeModule).length > 0) {
      return deepmerge(opts, babelMergeModule as Partial<InputOptions>);
    }
    if (typeof babelMergeModule === 'function') {
      const merge = babelMergeModule as BabelMergeFunction;
      const result = merge(context, opts, deepmerge);
      if (typeof result === 'object' && Object.keys(result).length > 0) {
        return result;
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Rockpack/Babel: can't merge ${configFile}`, error);
  }

  return opts;
};
