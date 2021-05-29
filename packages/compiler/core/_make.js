const webpack = require('webpack');
const path = require('path');
const { existsSync } = require('fs');
const { isFunction, isDefined } = require('valid-types');
const getMode = require('../utils/getMode');
const makeEntry = require('../modules/makeEntry');
const makeOutput = require('../modules/makeOutput');
const mergeConfWithDefault = require('../utils/mergeConfWithDefault');
const makeDevtool = require('../modules/makeDevtool');
const { makeModules } = require('../modules/makeModules');
const makePlugins = require('../modules/makePlugins');
const makeResolve = require('../modules/makeResolve');
const makeExternals = require('../modules/makeExternals');
const makeDevServer = require('../modules/makeDevServer');
const compileWebpackConfig = require('../utils/compileWebpackConfig');
const makeOptimization = require('../modules/makeOptimization');

const _make = async (conf, post) => {
  const mode = getMode();
  const root = path.dirname(require.main.filename);

  const packageJson = existsSync(path.resolve(root, 'package.json')) ?
    // eslint-disable-next-line global-require
    require(path.resolve(root, 'package.json')) :
    {};

  conf = await mergeConfWithDefault(conf, mode);

  const { entry, context } = makeEntry(conf, root, mode);
  const output = makeOutput(conf, root, mode);
  const devtool = makeDevtool(mode, conf);
  const devServer = makeDevServer(conf, root);
  const optimization = makeOptimization(mode, conf);
  const modules = makeModules(conf, root, packageJson, mode);
  const plugins = await makePlugins(conf, root, packageJson, mode, webpack, context);
  const resolve = makeResolve();
  const externals = makeExternals(conf, root);

  const finalConfig = {
    entry,
    output,
    devtool,
    devServer,
    resolve,
    optimization,
    externals
  };

  finalConfig.mode = mode;

  if (isDefined(conf.externals)) {
    finalConfig.externals = conf.externals;
  }

  if (conf.nodejs) {
    finalConfig.target = 'node';
  }

  if (mode === 'development') {
    finalConfig.watch = true;
    finalConfig.cache = true;
    finalConfig.performance = {
      hints: false
    };
  }

  if (mode === 'production') {
    finalConfig.performance = {
      hints: 'warning'
    };
    if (!finalConfig.output) {
      finalConfig.output = {};
    }
    finalConfig.output.pathinfo = false;
  }

  if (isFunction(post)) {
    post(finalConfig, modules, plugins);
  }

  const webpackConfig = compileWebpackConfig(
    finalConfig,
    conf,
    mode,
    root,
    modules,
    plugins
  );

  return { webpackConfig, conf };
};

module.exports = _make;
