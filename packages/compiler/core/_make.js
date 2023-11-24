const { existsSync } = require('node:fs');
const path = require('node:path');

const { getRootRequireDir, getMode } = require('@rockpack/utils');
const { isFunction, isDefined } = require('valid-types');
const webpack = require('webpack');

const makeDevServer = require('../modules/make-dev-server');
const makeDevtool = require('../modules/make-devtool');
const makeEntry = require('../modules/make-entry');
const makeExternals = require('../modules/make-externals');
const makeModules = require('../modules/make-modules');
const makeOptimization = require('../modules/make-optimization');
const makeOutput = require('../modules/make-output');
const makePlugins = require('../modules/make-plugins');
const makeResolve = require('../modules/make-resolve');
const makeStats = require('../modules/make-stats');
const compileWebpackConfig = require('../utils/compile-webpack-config');
const mergeConfWithDefault = require('../utils/merge-conf-with-default');

const _make = async (conf, post) => {
  const mode = getMode();
  const root = getRootRequireDir();

  const packageJson = existsSync(path.resolve(root, 'package.json'))
    ? // eslint-disable-next-line global-require,import/no-dynamic-require
      require(path.resolve(root, 'package.json'))
    : {};

  conf = await mergeConfWithDefault(conf, mode);

  const { entry, context } = makeEntry(conf, root, mode);
  const output = makeOutput(conf, root, mode);
  const devtool = makeDevtool(mode, conf);
  const devServer = await makeDevServer(conf);
  const optimization = makeOptimization(mode, conf);
  const modules = makeModules(conf, root, packageJson, mode);
  const plugins = await makePlugins(conf, root, packageJson, mode, webpack, context);
  const resolve = makeResolve(root);
  const stats = makeStats(conf);
  const externals = makeExternals(conf, root);

  const finalConfig = {
    devServer,
    devtool,
    entry,
    externals,
    optimization,
    output,
    resolve,
    stats,
  };

  finalConfig.infrastructureLogging = {
    level: 'error',
  };

  if (typeof conf.name === 'string') {
    finalConfig.name = conf.name;
  }

  finalConfig.mode = mode;

  if (isDefined(conf.externals)) {
    finalConfig.externals = conf.externals;
  }

  if (conf.nodejs) {
    finalConfig.target = 'node';
    finalConfig.externalsPresets = {
      node: true,
    };
  } else if (global.ISOMORPHIC) {
    finalConfig.externalsPresets = {
      node: true,
    };
  }

  if (mode === 'development' || conf.debug) {
    finalConfig.watch = true;
    finalConfig.cache = true;
    finalConfig.performance = {
      hints: false,
    };
  }

  if (mode === 'production' && !conf.debug) {
    finalConfig.performance = {
      hints: 'warning',
    };
    if (!finalConfig.output) {
      finalConfig.output = {};
    }
    finalConfig.output.pathinfo = false;
  }

  if (isFunction(post)) {
    post(finalConfig, modules, plugins, mode);
  }

  const webpackConfig = compileWebpackConfig(finalConfig, conf, mode, root, modules, plugins);

  return { conf, webpackConfig };
};

module.exports = _make;
