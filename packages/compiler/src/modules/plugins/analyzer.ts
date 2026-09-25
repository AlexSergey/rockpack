import type StatoscopeModule from '@statoscope/webpack-plugin';

import { createRequire } from 'node:module';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import type { PluginContext, PluginEntries } from './types.js';

import { fpPromise } from '../../utils/find-free-port.js';

const _require = createRequire(import.meta.url);

// A CommonJS package with `exports.default`: an ES module default import would get the exports object, not the class.
const { default: StatoscopeWebpackPlugin } = _require('@statoscope/webpack-plugin') as {
  default: typeof StatoscopeModule;
};

export const makeAnalyzerPlugins = async ({ conf, mode }: PluginContext): Promise<PluginEntries> => {
  if (!conf.analyzer) {
    return {};
  }
  const isDevelopment = mode === 'development';

  return {
    BundleAnalyzerPlugin: new BundleAnalyzerPlugin(
      isDevelopment
        ? { analyzerPort: await fpPromise(8888) }
        : { analyzerMode: 'static', openAnalyzer: false, reportFilename: 'webpack-report.html' },
    ),
    StatoscopeWebpackPlugin: new StatoscopeWebpackPlugin({ watchMode: isDevelopment }),
  };
};
