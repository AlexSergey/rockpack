import type { PluginItem } from '@babel/core';

import { readPackageJson } from '@rockpack/utils';

import type { BabelMergeContext } from './types.js';

import { buildTargets, usesPresetEnv } from './presets.js';
import { getPreset } from './resolve.js';

// Only a runtime dependency enables polyfills: a devDependency never reaches the bundle.
export const readCoreJsVersion = (root: string): false | string => {
  const coreJsDep = readPackageJson(root)?.dependencies?.['core-js'];

  return typeof coreJsDep === 'string' ? coreJsDep : false;
};

// Imports the core-js polyfills the code uses and the targets lack (Babel 7's preset-env `useBuiltIns: 'usage'`).
export const buildPolyfillPlugins = (context: BabelMergeContext, corejs: false | string): PluginItem[] =>
  typeof corejs === 'string' && usesPresetEnv(context)
    ? [
        getPreset('babel-plugin-polyfill-corejs3', {
          method: 'usage-global',
          targets: buildTargets(context),
          version: corejs,
        }),
      ]
    : [];
