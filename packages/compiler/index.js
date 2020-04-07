const webpack = require('webpack');
const { argv } = require('yargs');
const { babelOpts } = require('./modules/makeModules');
const makeWebpackConfig = require('./compilers/makeWebpackConfig');
const markupCompiler = require('./compilers/markupCompiler');
const libraryCompiler = require('./compilers/libraryCompiler');
const frontendCompiler = require('./compilers/frontendCompiler');
const documentationCompiler = require('./compilers/documentationCompiler');
const backendCompiler = require('./compilers/backendCompiler');
const analyzerCompiler = require('./compilers/analyzerCompiler');
const multiCompiler = require('./compilers/multiCompiler');
const isomorphicCompiler = require('./compilers/isomorphicCompiler');
const localazer = require('./compilers/localazer');

const getArgs = () => argv;

const getWebpack = () => webpack;

module.exports = {
  getWebpack,
  getArgs,
  makeWebpackConfig,
  multiCompiler,
  isomorphicCompiler,
  babelOpts,
  markupCompiler,
  libraryCompiler,
  frontendCompiler,
  documentationCompiler,
  backendCompiler,
  analyzerCompiler,
  localazer
};
