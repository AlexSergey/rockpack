import webpack from 'webpack';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { backendCompiler } from './compilers/backend-compiler.js';
import { frontendCompiler } from './compilers/frontend-compiler.js';
import { isomorphicCompiler } from './compilers/isomorphic-compiler.js';
import { libraryCompiler } from './compilers/library-compiler.js';
import { makeWebpackConfig } from './compilers/make-webpack-config.js';
import { sourceCompiler } from './compilers/source-compiler.js';
import { RockpackError } from './errors/rockpack-error.js';

const argv = yargs(hideBin(process.argv)).parseSync();

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- public API: callers name the argv shape
const getArgs = <T extends Record<string, unknown> = Record<never, never>>(): T & typeof argv =>
  argv as T & typeof argv;

const getWebpack = (): typeof webpack => webpack;

export {
  backendCompiler,
  frontendCompiler,
  getArgs,
  getWebpack,
  isomorphicCompiler,
  libraryCompiler,
  makeWebpackConfig,
  RockpackError,
  sourceCompiler,
};

export type { RockpackErrorCode } from './errors/rockpack-error.js';
