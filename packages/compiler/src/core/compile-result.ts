import type { Compiler, Configuration, MultiCompiler, MultiStats, Stats } from 'webpack';

import type { InternalCompilerConf } from '../types.js';

// A production build that has finished; `success` is false when webpack reported errors.
export type BuildResult = {
  readonly kind: 'build';
  readonly stats: MultiStats | Stats | undefined;
  readonly success: boolean;
};

export type CompileOutcome = BuildResult | ConfigResult | RunningResult;

export type CompilerResult = BuildResult | ConfigResult | DevServerResult | WatchResult;

// Only the webpack config was built (configOnly, makeWebpackConfig and the parts of an isomorphic build).
export type ConfigResult = {
  readonly conf: InternalCompilerConf;
  readonly kind: 'config';
  readonly webpackConfig: Configuration;
};

// The frontend development server.
export type DevServerResult = {
  readonly kind: 'dev-server';
  readonly stop: () => Promise<void>;
  readonly url: string;
};

// What compile() hands to the compilers: a watching build keeps what the dev server needs.
export type RunningResult = WatchResult & {
  readonly compiler: Compiler | MultiCompiler;
  readonly conf: InternalCompilerConf;
  readonly webpackConfig: Configuration;
};

// A development build that keeps watching until stopped.
export type WatchResult = {
  readonly kind: 'watch';
  readonly stop: () => Promise<void>;
};

export const closeCompiler = (compiler: Compiler | MultiCompiler): Promise<void> =>
  new Promise((resolve) => {
    compiler.close(() => {
      resolve();
    });
  });
