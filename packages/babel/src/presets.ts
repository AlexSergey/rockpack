import type { PluginItem } from '@babel/core';

import type { BabelMergeContext } from './types.js';

import { getPreset } from './resolve.js';

export const buildPresets = (
  { framework, isNodejs, modules, typescript, typescriptEnv }: BabelMergeContext,
  corejs: false | string,
): PluginItem[] => {
  const env = getPreset('@babel/preset-env', {
    modules,
    ...(isNodejs ? { targets: { node: 'current' } } : { targets: { browsers: ['> 5%'] } }),
    ...(typeof corejs === 'string' ? { corejs, useBuiltIns: 'usage' } : {}),
  });
  const ts = getPreset('@babel/preset-typescript');

  // Presets run last to first: TypeScript is stripped before preset-env transforms the result.
  let presets: PluginItem[] = [env];
  if (typescript) {
    presets = typescriptEnv ? [env, ts] : [ts];
  }

  if (framework === 'react') {
    presets.push(
      getPreset('@babel/preset-react', {
        runtime: 'automatic',
        useBuiltIns: true,
      }),
    );
  }

  return presets;
};
