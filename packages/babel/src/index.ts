import type { TransformOptions } from '@babel/core';

import type { BabelMergeContext, CreateBabelPresetsOptions } from './types.js';

import { readCoreJsVersion } from './core-js.js';
import { buildPlugins, buildProductionPlugins } from './plugins.js';
import { buildPresets } from './presets.js';
import { applyUserConfig } from './user-config.js';

export type { BabelMergeContext, BabelMergeFunction, CreateBabelPresetsOptions, Framework, Modules } from './types.js';

export const createBabelPresets = ({
  framework = 'none',
  isNodejs = false,
  isTest = false,
  modules = false,
  typescript = false,
}: CreateBabelPresetsOptions = {}): TransformOptions => {
  const root = process.cwd();
  const context: BabelMergeContext = { framework, isNodejs, isTest, modules, typescript };
  const productionPlugins = buildProductionPlugins(context);

  const opts: TransformOptions = {
    babelrc: false,
    env: {
      production: productionPlugins.length > 0 ? { plugins: productionPlugins } : {},
    },
    plugins: buildPlugins(context),
    presets: buildPresets(context, readCoreJsVersion(root)),
  };

  return applyUserConfig(opts, context, root);
};
