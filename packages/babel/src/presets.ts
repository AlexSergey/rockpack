import type { PluginItem } from '@babel/core';

import type { BabelMergeContext } from './types.js';

import { getPreset } from './resolve.js';

export const buildPresets = (
  { framework, isNodejs, modules, typescript }: BabelMergeContext,
  corejs: false | string,
): PluginItem[] => {
  const presets: PluginItem[] = typescript
    ? [getPreset('@babel/preset-typescript')]
    : [
        getPreset('@babel/preset-env', {
          modules,
          ...(isNodejs ? { targets: { node: 'current' } } : { targets: { browsers: ['> 5%'] } }),
          ...(typeof corejs === 'string' ? { corejs, useBuiltIns: 'usage' } : {}),
        }),
      ];

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
