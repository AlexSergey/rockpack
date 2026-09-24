import type { Configuration, RuleSetRule, WebpackPluginInstance } from 'webpack';

import type { Collection } from './collection.js';

export const compileWebpackConfig = (
  finalConfig: Record<string, unknown>,
  modules: Collection<RuleSetRule> | null,
  plugins: Collection<WebpackPluginInstance> | null,
): Configuration => {
  const webpackConfig: Record<string, unknown> = { ...finalConfig };

  if (modules) {
    webpackConfig['module'] = { rules: modules.get() };
  }

  if (plugins) {
    webpackConfig['plugins'] = plugins.get();
  }

  return webpackConfig;
};
