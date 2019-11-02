const webpack = require('webpack');
const path = require('path');
const { existsSync } = require('fs');
const makeMode = require('../modules/makeMode');
const makeEntry = require('../modules/makeEntry');
const makeOutput = require('../modules/makeOutput');
const makeNode = require('../modules/makeNode');
const makeVersion = require('../modules/makeVersion');
const mergeConfWithDefault = require('../modules/mergeConfWithDefault');
const makeDevtool = require('../modules/makeDevtool');
const { makeModules } = require('../modules/makeModules');
const makePlugins = require('../modules/makePlugins');
const makeResolve = require('../modules/makeResolve');
const makeDevServer = require('../modules/makeDevServer');
const compileWebpackConfig = require('../modules/compileWebpackConfig');
const makeOptimization = require('../modules/makeOptimization');
const { isFunction } = require('valid-types');

const _make = async (conf, post) => {
    let mode = makeMode();
    const root = path.dirname(require.main.filename);
    const packageJson = existsSync(path.resolve(root, 'package.json')) ? require(path.resolve(root, 'package.json')) : {};
    conf = await mergeConfWithDefault(conf, mode);
    const version = makeVersion(conf);
    let entry = makeEntry(conf, root, mode);
    let output = makeOutput(conf, root, version);
    let devtool = makeDevtool(mode, conf);
    let devServer = makeDevServer(conf, root);
    let optimization = makeOptimization(conf);
    let modules = makeModules(conf, root, packageJson, mode);
    let plugins = await makePlugins(conf, root, packageJson, mode, webpack, version);
    let resolve = makeResolve();

    let finalConfig = {
        entry,
        output,
        devtool,
        devServer,
        resolve,
        optimization
    };

    if (conf.nodejs) {
        finalConfig.node = makeNode();
        finalConfig.target = 'node';

        if (mode === 'development') {
            finalConfig.watch = true;
        }
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
