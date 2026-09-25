import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import type { InternalCompilerConf, Mode } from '../types.js';

export const makeOptimization = (mode: Mode, conf: Partial<InternalCompilerConf>): Record<string, unknown> => {
  const optimization: Record<string, unknown> = {};

  if (mode === 'development') {
    Object.assign(optimization, {
      checkWasmTypes: false,
      chunkIds: 'named',
      concatenateModules: false,
      emitOnErrors: true,
      flagIncludedChunks: false,
      minimize: false,
      moduleIds: 'named',
      nodeEnv: mode,
      removeAvailableModules: false,
      splitChunks: {
        hidePathInfo: false,
        maxAsyncRequests: Infinity,
        maxInitialRequests: Infinity,
        minSize: 10000,
      },
    });
  }

  if (mode === 'production') {
    Object.assign(optimization, {
      checkWasmTypes: true,
      chunkIds: conf.debug ? 'named' : 'total-size',
      concatenateModules: true,
      emitOnErrors: false,
      flagIncludedChunks: true,
      mangleExports: false,
      minimize: true,
      minimizer: [
        new ImageMinimizerPlugin<Parameters<typeof ImageMinimizerPlugin.sharpMinify>[1]>({
          minimizer: {
            implementation: ImageMinimizerPlugin.sharpMinify,
            options: {
              encodeOptions: {
                jpeg: { quality: 80 },
                png: { adaptiveFiltering: true, force: true, quality: 80 },
              },
            },
          },
        }),
        new TerserPlugin({
          terserOptions: {
            // Browser bundles drop console calls; Node.js bundles keep them, they are the server logs.
            // eslint-disable-next-line camelcase
            compress: { drop_console: !conf.debug && !conf.nodejs },
            // eslint-disable-next-line camelcase
            keep_classnames: true,
            // eslint-disable-next-line camelcase
            keep_fnames: true,
            mangle: true,
            output: { comments: /banner/ },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      moduleIds: conf.debug ? 'named' : 'size',
      nodeEnv: mode,
      removeAvailableModules: true,
      removeEmptyChunks: true,
      sideEffects: true,
      splitChunks: {
        hidePathInfo: true,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        minSize: 30000,
      },
      usedExports: true,
    });
  }

  return optimization;
};
