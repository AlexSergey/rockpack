import CopyWebpackPlugin from 'copy-webpack-plugin';

import type { PluginContext, PluginEntries } from './types.js';

type CopyPluginConfig = NonNullable<ConstructorParameters<typeof CopyWebpackPlugin>[0]>;

// conf.copy is a { from, to } pair, an array of pairs, or { files, opts }.
export const makeCopyPlugins = ({ conf }: PluginContext): PluginEntries => {
  const { copy } = conf;
  if (!copy) {
    return {};
  }
  let patterns: CopyPluginConfig['patterns'] | null = null;
  let options: NonNullable<CopyPluginConfig['options']> = {};

  if (Array.isArray(copy)) {
    patterns = copy;
  } else if ('files' in copy) {
    patterns = copy.files;
    options = copy.opts ?? {};
  } else if (copy.from && copy.to) {
    patterns = [copy];
  }

  return patterns ? { CopyWebpackPlugin: new CopyWebpackPlugin({ options, patterns }) } : {};
};
