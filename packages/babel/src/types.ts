import type { TransformOptions } from '@babel/core';
import type deepmerge from 'deepmerge';

export type BabelMergeContext = {
  readonly framework: Framework;
  readonly isNodejs: boolean;
  readonly isTest: boolean;
  readonly modules: Modules;
  readonly typescript: boolean;
};

export type BabelMergeFunction = (
  context: BabelMergeContext,
  opts: TransformOptions,
  merge: typeof deepmerge,
) => TransformOptions;

export type CreateBabelPresetsOptions = {
  readonly framework?: Framework;
  readonly isNodejs?: boolean;
  readonly isTest?: boolean;
  readonly modules?: Modules;
  readonly typescript?: boolean;
};

export type Framework = 'none' | 'react';

export type Modules = 'amd' | 'auto' | 'cjs' | 'commonjs' | 'systemjs' | 'umd' | false;
