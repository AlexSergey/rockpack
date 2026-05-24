import type { Collection } from './collection.js';

export const compileWebpackConfig = (
  finalConfig: Record<string, unknown>,
  _conf: unknown,
  _mode: string,
  _root: string,
  modules: Collection | null,
  plugins: Collection | null,
): Record<string, unknown> => {
  const webpackConfig: Record<string, unknown> = { ...finalConfig };

  if (modules) {
    webpackConfig['module'] = { rules: modules.get() };
  }

  if (plugins) {
    webpackConfig['plugins'] = plugins.get();
  }

  return webpackConfig;
};
