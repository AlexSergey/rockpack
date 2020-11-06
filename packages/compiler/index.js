const webpack = require('webpack');
const { argv } = require('yargs');
const makeWebpackConfig = require('./compilers/makeWebpackConfig');
const markupCompiler = require('./compilers/markupCompiler');
const libraryCompiler = require('./compilers/libraryCompiler');
const frontendCompiler = require('./compilers/frontendCompiler');
const backendCompiler = require('./compilers/backendCompiler');
const analyzerCompiler = require('./compilers/analyzerCompiler');
const isomorphicCompiler = require('./compilers/isomorphicCompiler');
const localazer = require('./compilers/localazer');

const getArgs = () => argv;

const getWebpack = () => webpack;

module.exports = {
  getWebpack,
  getArgs,
  makeWebpackConfig,
  isomorphicCompiler,
  markupCompiler,
  libraryCompiler,
  frontendCompiler,
  backendCompiler,
  analyzerCompiler,
  localazer
};
