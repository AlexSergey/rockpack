import webpack from 'webpack';

import type { Argv } from './core/argv.js';

import { backendCompiler } from './compilers/backend-compiler.js';
import { frontendCompiler } from './compilers/frontend-compiler.js';
import { isomorphicCompiler } from './compilers/isomorphic-compiler.js';
import { libraryCompiler } from './compilers/library-compiler.js';
import { makeWebpackConfig } from './compilers/make-webpack-config.js';
import { sourceCompiler } from './compilers/source-compiler.js';
import { getArgv } from './core/argv.js';
import { RockpackError } from './errors/rockpack-error.js';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- public API: callers name the argv shape
const getArgs = <T extends Record<string, unknown> = Record<never, never>>(): Argv & T => getArgv() as Argv & T;

const getWebpack = (): typeof webpack => webpack;

export {
  backendCompiler,
  frontendCompiler,
  getArgs,
  getWebpack,
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- the options overload is current; one overload is deprecated
  isomorphicCompiler,
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- the options overload is current; one overload is deprecated
  libraryCompiler,
  makeWebpackConfig,
  RockpackError,
  sourceCompiler,
};

export type { IsomorphicCompilerOptions } from './compilers/isomorphic-compiler.js';
export type { LibraryCompilerOptions } from './compilers/library-compiler.js';
export type { RockpackErrorCode } from './errors/rockpack-error.js';
