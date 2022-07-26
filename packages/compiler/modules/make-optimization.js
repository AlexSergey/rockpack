const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { isArray } = require('valid-types');

const makeOptimization = (mode, conf) => {
  const optimization = {};

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
      chunkIds: 'total-size',
      concatenateModules: true,
      emitOnErrors: false,
      flagIncludedChunks: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              // eslint-disable-next-line camelcase
              drop_console: !conf.debug,
              // eslint-disable-next-line camelcase
              drop_debugger: !conf.debug,
            },
            mangle: true,
            output: {
              comments: /banner/,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      moduleIds: 'size',
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
    Object.assign(optimization.splitChunks, {
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

module.exports = makeOptimization;
