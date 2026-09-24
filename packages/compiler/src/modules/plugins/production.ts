import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FlagDependencyUsagePlugin from 'webpack/lib/FlagDependencyUsagePlugin.js';
import FlagIncludedChunksPlugin from 'webpack/lib/optimize/FlagIncludedChunksPlugin.js';

import type { PluginContext, PluginEntries } from './types.js';

export const makeProductionPlugins = ({ conf, mode, wp }: PluginContext): PluginEntries => {
  if (mode !== 'production') {
    return {};
  }
  const styleName = typeof conf.styles === 'string' && conf.styles.includes('.css') ? conf.styles : 'css/styles.css';

  // Entries keep the plugin order stable (object literals get sorted by the linter).
  return Object.fromEntries([
    ['CaseSensitivePathsPlugin', new CaseSensitivePathsPlugin()],
    ['MiniCssExtractPlugin', new MiniCssExtractPlugin({ filename: styleName })],
    ['FlagDependencyUsagePlugin', new FlagDependencyUsagePlugin()],
    ['FlagIncludedChunksPlugin', new FlagIncludedChunksPlugin()],
    ['NoEmitOnErrorsPlugin', new wp.NoEmitOnErrorsPlugin()],
    ['SideEffectsFlagPlugin', new wp.optimize.SideEffectsFlagPlugin()],
  ]);
};
