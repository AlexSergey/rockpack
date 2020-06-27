const webpack = require('webpack');
const path = require('path');
const { existsSync } = require('fs');
const { isFunction } = require('valid-types');
const getMode = require('../utils/getMode');
const makeEntry = require('../modules/makeEntry');
const makeOutput = require('../modules/makeOutput');
const makeNode = require('../modules/makeNode');
const makeVersion = require('../modules/makeVersion');
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
  // eslint-disable-next-line global-require
  const packageJson = existsSync(path.resolve(root, 'package.json')) ? require(path.resolve(root, 'package.json')) : {};
  conf = await mergeConfWithDefault(conf, mode);
  const version = makeVersion(conf);
  const entry = makeEntry(conf, root, mode);
  const output = makeOutput(conf, root, version);
  const devtool = makeDevtool(mode, conf);
  const devServer = makeDevServer(conf, root);
  const optimization = makeOptimization(mode, conf);
  const modules = makeModules(conf, root, packageJson, mode);
  const plugins = await makePlugins(conf, root, packageJson, mode, webpack, version);
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

  if (conf.nodejs) {
    finalConfig.node = makeNode();
    finalConfig.target = 'node';

    if (mode === 'development') {
      finalConfig.watch = true;
    }
  }

  if (mode === 'development') {
    finalConfig.cache = true;
    finalConfig.performance = {
      hints: false
    };
  }
  if (mode === 'production') {
    finalConfig.performance = {
      hints: 'warning'
    };
    finalConfig.output = {
      pathinfo: false
    };
  }

  if (isFunction(post)) {
    post(finalConfig, modules, plugins);
  }

  return compileWebpackConfig(
    finalConfig,
    conf,
    mode,
    root,
    modules,
    plugins
  );
};

module.exports = _make;
