import type { PluginItem } from '@babel/core';

import type { BabelMergeContext } from './types.js';

import { _require, getPreset } from './resolve.js';

export const buildPlugins = ({ framework, isTest, typescript }: BabelMergeContext): PluginItem[] => {
  const plugins: PluginItem[] = [];

  if (framework === 'react') {
    plugins.push(getPreset('babel-plugin-react-compiler'));
  }

  plugins.push(
    getPreset('@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }),
    getPreset('@babel/plugin-proposal-do-expressions'),
    getPreset('@babel/plugin-proposal-decorators', { legacy: true }),
  );

  if (typescript) {
    plugins.push(_require.resolve('babel-plugin-transform-typescript-metadata'));
  }

  if (isTest) {
    plugins.push(
      _require.resolve('@rockpack/babel/plugins/rename-cjs-globals'),
      _require.resolve('babel-plugin-transform-import-meta'),
      _require.resolve('@babel/plugin-transform-modules-commonjs'),
    );
  }

  return plugins;
};

export const buildProductionPlugins = ({ framework }: BabelMergeContext): PluginItem[] =>
  framework === 'react' ? [_require.resolve('@babel/plugin-transform-react-constant-elements')] : [];
