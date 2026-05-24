import webpack from 'webpack';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { backendCompiler } from './compilers/backend-compiler.js';
import { frontendCompiler } from './compilers/frontend-compiler.js';
import { isomorphicCompiler } from './compilers/isomorphic-compiler.js';
import { libraryCompiler } from './compilers/library-compiler.js';
import { makeWebpackConfig } from './compilers/make-webpack-config.js';
import { sourceCompiler } from './compilers/source-compiler.js';

const argv = yargs(hideBin(process.argv)).parseSync();

const getArgs = (): typeof argv => argv;

const getWebpack = (): typeof webpack => webpack;

export {
  backendCompiler,
  frontendCompiler,
  getArgs,
  getWebpack,
  isomorphicCompiler,
  libraryCompiler,
  makeWebpackConfig,
  sourceCompiler,
};
