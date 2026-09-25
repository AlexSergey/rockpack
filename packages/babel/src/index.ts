import type { InputOptions } from '@babel/core';

import type { BabelMergeContext, CreateBabelPresetsOptions } from './types.js';

import { buildPolyfillPlugins, readCoreJsVersion } from './core-js.js';
import { buildPlugins, buildProductionPlugins } from './plugins.js';
import { buildPresets } from './presets.js';
import { applyUserConfig } from './user-config.js';

export type {
  BabelMergeContext,
  BabelMergeFunction,
  CreateBabelPresetsOptions,
  Framework,
  Modules,
  TypescriptOptions,
} from './types.js';

export const createBabelPresets = ({
  framework = 'none',
  isNodejs = false,
  isTest = false,
  modules = false,
  typescript = false,
}: CreateBabelPresetsOptions = {}): InputOptions => {
  const root = process.cwd();
  const context: BabelMergeContext = {
    framework,
    isNodejs,
    isTest,
    modules,
    typescript: typescript !== false,
    typescriptEnv: typeof typescript === 'object' && typescript.env === true,
  };
  const productionPlugins = buildProductionPlugins(context);

  const opts: InputOptions = {
    babelrc: false,
    env: {
      production: productionPlugins.length > 0 ? { plugins: productionPlugins } : {},
    },
    plugins: [...buildPlugins(context), ...buildPolyfillPlugins(context, readCoreJsVersion(root))],
    presets: buildPresets(context),
  };

  return applyUserConfig(opts, context, root);
};
