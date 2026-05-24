import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import type { CompilerConf, Mode } from '../types.js';

import { isArray } from '../utils/valid-types-compat.js';

export const makeOptimization = (mode: Mode, conf: Partial<CompilerConf>): Record<string, unknown> => {
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
        new ImageMinimizerPlugin({
          minimizer: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            implementation: ImageMinimizerPlugin.sharpMinify as any,
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
            // eslint-disable-next-line camelcase
            compress: { drop_console: !conf.debug },
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

  if (isArray(conf.vendor)) {
    const splitChunks = optimization['splitChunks'] as Record<string, unknown>;
    Object.assign(splitChunks, {
      cacheGroups: {
        defaultVendors: {
          chunks: 'initial',
          enforce: true,
          name: 'vendor',
          test: 'vendor',
        },
      },
    });
  }

  return optimization;
};
