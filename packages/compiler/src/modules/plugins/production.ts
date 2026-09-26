import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import type { PluginContext, PluginEntries } from './types.js';

import { stylesFilename } from './styles-filename.js';

// The optimization settings (make-optimization.ts) apply the flagging plugins and skip emitting on errors.
export const makeProductionPlugins = ({ conf, mode }: PluginContext): PluginEntries => {
  if (mode !== 'production') {
    return {};
  }

  // Entries keep the plugin order stable (object literals get sorted by the linter).
  return Object.fromEntries([
    ['CaseSensitivePathsPlugin', new CaseSensitivePathsPlugin()],
    ['MiniCssExtractPlugin', new MiniCssExtractPlugin({ filename: stylesFilename(conf) })],
  ]);
};
