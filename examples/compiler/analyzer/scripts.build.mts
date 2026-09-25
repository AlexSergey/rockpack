import { frontendCompiler } from '@rockpack/compiler';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// Rockpack ships no analyzer: the project adds the one it wants through the callback.
void frontendCompiler(
  {
    banner: true,
    styles: 'style.css',
  },
  (config, modules, plugins, mode) => {
    if (mode === 'production') {
      plugins.set(
        'BundleAnalyzerPlugin',
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'webpack-report.html',
        }),
      );
    }
  },
);
