import StatoscopeWebpackPlugin from '@statoscope/webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import type { PluginContext, PluginEntries } from './types.js';

import { fpPromise } from '../../utils/find-free-port.js';

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
