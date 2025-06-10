const webpack = require('webpack');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).parse();

const backendCompiler = require('./compilers/backend-compiler');
const frontendCompiler = require('./compilers/frontend-compiler');
const isomorphicCompiler = require('./compilers/isomorphic-compiler');
const libraryCompiler = require('./compilers/library-compiler');
const makeWebpackConfig = require('./compilers/make-webpack-config');
const markupCompiler = require('./compilers/markup-compiler');
const webViewCompiler = require('./compilers/web-view-compiler');

const getArgs = () => argv;

const getWebpack = () => webpack;

module.exports = {
  backendCompiler,
  frontendCompiler,
  getArgs,
  getWebpack,
  isomorphicCompiler,
  libraryCompiler,
  makeWebpackConfig,
  markupCompiler,
  webViewCompiler,
};
