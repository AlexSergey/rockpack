import type { Configuration } from 'webpack';

import { getMode, getRootRequireDir, readPackageJson } from '@rockpack/utils';
import webpack from 'webpack';

import type { InternalCompilerConf, Mode, PackageJson } from '../types.js';

import { makeDevServer } from '../modules/make-dev-server.js';
import { makeDevtool } from '../modules/make-devtool.js';
import { makeEntry } from '../modules/make-entry.js';
import { makeExternals } from '../modules/make-externals.js';
import { makeModules } from '../modules/make-modules.js';
import { makeOptimization } from '../modules/make-optimization.js';
import { makeOutput } from '../modules/make-output.js';
import { makePlugins } from '../modules/make-plugins.js';
import { makeResolve } from '../modules/make-resolve.js';
import { makeStats } from '../modules/make-stats.js';
import { compileWebpackConfig } from '../utils/compile-webpack-config.js';

type MakeResult = {
  conf: InternalCompilerConf;
  webpackConfig: Configuration;
};

type PostFn = (
  config: Configuration,
  modules: ReturnType<typeof makeModules>,
  plugins: Awaited<ReturnType<typeof makePlugins>>,
  mode: Mode,
) => void;

// `conf` is already merged with the defaults by compile().
export const make = async (conf: InternalCompilerConf, post: null | PostFn): Promise<MakeResult> => {
  const mode = getMode();
  const root = getRootRequireDir();

  const packageJson: PackageJson = readPackageJson(root) ?? {};

  const { context, entry } = makeEntry(conf, root, mode);
  const output = makeOutput(conf, root, mode);
  const devtool = makeDevtool(mode);
  const devServer = await makeDevServer(conf);
  const optimization = makeOptimization(mode, conf);
  const modules = makeModules(conf, root, packageJson, mode);
  const plugins = await makePlugins(conf, root, packageJson, mode, webpack, context);
  const resolve = makeResolve(root);
  const stats = makeStats(conf);
  const externals = makeExternals(conf, root);

  const finalConfig: Record<string, unknown> = {
    devServer,
    devtool,
    entry,
    externals,
    infrastructureLogging: { level: 'error' },
    mode,
    optimization,
    output,
    resolve,
    stats,
  };

  if (typeof conf.name === 'string') {
    finalConfig['name'] = conf.name;
  }

  if (conf.externals !== undefined) {
    finalConfig['externals'] = conf.externals;
  }

  if (conf.nodejs) {
    finalConfig['target'] = 'node';
    finalConfig['externalsPresets'] = { node: true };
  } else if (global.ISOMORPHIC) {
    finalConfig['externalsPresets'] = { node: true };
  }

  if (mode === 'development') {
    finalConfig['watch'] = true;
    finalConfig['cache'] = true;
    finalConfig['performance'] = { hints: false };
  }

  if (mode === 'production') {
    finalConfig['performance'] = { hints: 'warning' };
    finalConfig['output'] ??= {};
    (finalConfig['output'] as Record<string, unknown>)['pathinfo'] = false;
  }

  if (post !== null) {
    post(finalConfig, modules, plugins, mode);
  }

  const webpackConfig = compileWebpackConfig(finalConfig, conf, mode, root, modules, plugins);

  return { conf: conf, webpackConfig };
};
