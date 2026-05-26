import type { Configuration } from 'webpack';

import { getMode, getRootRequireDir } from '@rockpack/utils';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { isDefined } from 'valid-types';
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
import { mergeConfWithDefault } from '../utils/merge-conf-with-default.js';

interface MakeResult {
  conf: InternalCompilerConf;
  webpackConfig: Configuration;
}

type PostFn = (
  config: Configuration,
  modules: ReturnType<typeof makeModules>,
  plugins: Awaited<ReturnType<typeof makePlugins>>,
  mode: Mode,
) => void;

export const make = async (conf: InternalCompilerConf, post: null | PostFn): Promise<MakeResult> => {
  const mode = getMode() as Mode;
  const root = getRootRequireDir();

  const packageJson: PackageJson = existsSync(path.resolve(root, 'package.json'))
    ? (JSON.parse(readFileSync(path.resolve(root, 'package.json'), 'utf8')) as PackageJson)
    : {};

  const mergedConf = await mergeConfWithDefault(conf, mode);

  const { context, entry } = makeEntry(mergedConf, root, mode);
  const output = makeOutput(mergedConf, root, mode);
  const devtool = makeDevtool(mode);
  const devServer = await makeDevServer(mergedConf);
  const optimization = makeOptimization(mode, mergedConf);
  const modules = makeModules(mergedConf, root, packageJson, mode);
  const plugins = await makePlugins(mergedConf, root, packageJson, mode, webpack, context);
  const resolve = makeResolve(root);
  const stats = makeStats(mergedConf);
  const externals = makeExternals(mergedConf, root);

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

  if (typeof mergedConf.name === 'string') {
    finalConfig['name'] = mergedConf.name;
  }

  if (isDefined(mergedConf.externals)) {
    finalConfig['externals'] = mergedConf.externals;
  }

  if (mergedConf.nodejs) {
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
    if (!finalConfig['output']) {
      finalConfig['output'] = {};
    }
    (finalConfig['output'] as Record<string, unknown>)['pathinfo'] = false;
  }

  if (post !== null) {
    post(finalConfig, modules, plugins, mode);
  }

  const webpackConfig = compileWebpackConfig(finalConfig, mergedConf, mode, root, modules, plugins);

  return { conf: mergedConf, webpackConfig };
};
