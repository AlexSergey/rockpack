import type { TransformOptions } from '@babel/core';

import deepmerge from 'deepmerge';
import { existsSync } from 'node:fs';
import path from 'node:path';

import type { BabelMergeContext, BabelMergeFunction } from './types.js';

import { _require } from './resolve.js';

export const applyUserConfig = (opts: TransformOptions, context: BabelMergeContext, root: string): TransformOptions => {
  const babelMergePath = path.resolve(root, 'rockpack.babel.js');

  if (!existsSync(babelMergePath)) {
    return opts;
  }

  try {
    const babelMergeModule: unknown = _require(babelMergePath);

    if (typeof babelMergeModule === 'object' && babelMergeModule !== null && Object.keys(babelMergeModule).length > 0) {
      return deepmerge(opts, babelMergeModule as Partial<TransformOptions>);
    }
    if (typeof babelMergeModule === 'function') {
      const merge = babelMergeModule as BabelMergeFunction;
      const result = merge(context, opts, deepmerge);
      if (typeof result === 'object' && Object.keys(result).length > 0) {
        return result;
      }
    }
  } catch {
    // eslint-disable-next-line no-console
    console.error("Rockpack/Babel: can't merge rockpack.babel.js");
  }

  return opts;
};
