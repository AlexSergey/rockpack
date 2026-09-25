import type { PresetItem } from '@babel/core';

import type { BabelMergeContext } from './types.js';

import { getPreset } from './resolve.js';

export const buildTargets = ({ isNodejs }: BabelMergeContext): Record<string, unknown> =>
  isNodejs ? { node: 'current' } : { browsers: ['> 5%'] };

// preset-env transforms the code unless it is TypeScript without `typescript: { env: true }`.
export const usesPresetEnv = ({ typescript, typescriptEnv }: BabelMergeContext): boolean =>
  !typescript || typescriptEnv;

export const buildPresets = (context: BabelMergeContext): PresetItem[] => {
  const { framework, modules, typescript } = context;
  const env = getPreset('@babel/preset-env', { modules, targets: buildTargets(context) });
  const ts = getPreset('@babel/preset-typescript');

  // Presets run last to first: TypeScript is stripped before preset-env transforms the result.
  let presets: PresetItem[] = [env];
  if (typescript) {
    presets = usesPresetEnv(context) ? [env, ts] : [ts];
  }

  if (framework === 'react') {
    presets.push(getPreset('@rockpack/babel/presets/react', { runtime: 'automatic' }));
  }

  return presets;
};
