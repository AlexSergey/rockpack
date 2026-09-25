import type { InputOptions } from '@babel/core';
import type deepmerge from 'deepmerge';

export type BabelMergeContext = {
  readonly framework: Framework;
  readonly isNodejs: boolean;
  readonly isTest: boolean;
  readonly modules: Modules;
  readonly typescript: boolean;
  // preset-env also runs after preset-typescript (`typescript: { env: true }`).
  readonly typescriptEnv: boolean;
};

export type BabelMergeFunction = (
  context: BabelMergeContext,
  opts: InputOptions,
  merge: typeof deepmerge,
) => InputOptions;

export type CreateBabelPresetsOptions = {
  readonly framework?: Framework;
  readonly isNodejs?: boolean;
  readonly isTest?: boolean;
  readonly modules?: Modules;
  readonly typescript?: boolean | TypescriptOptions;
};

export type Framework = 'none' | 'react';

export type Modules = 'amd' | 'auto' | 'cjs' | 'commonjs' | 'systemjs' | 'umd' | false;

export type TypescriptOptions = {
  // Also run preset-env, so `modules`, `isNodejs` and core-js apply to TypeScript. Off by default in 9.x.
  readonly env?: boolean;
};
